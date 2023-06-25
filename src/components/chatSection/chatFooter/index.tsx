import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import type { ChatItem } from "@/hooks/useChannel";
import {
  AiOutlineRedo,
  AiOutlineClear,
  AiOutlineShareAlt,
  AiOutlineLoading,
} from "react-icons/ai";
import { BsStop } from "react-icons/bs";
import { useDebounceFn } from "ahooks";
import toast from "react-hot-toast";
import {
  useChannel,
  useOpenAI,
  useStreamDecoder,
  useUserInfo,
  useLLM,
  usePremium,
  useRecharge,
  BASE_PROMPT,
  ChannelListItem,
} from "@/hooks";
import { Button, Confirm, Link } from "@/components/ui";
import { useScrollToBottom } from "@/components/scrollToBottoms";
import { isMobile, cn, calcTokens } from "@/lib";
import type { IShare } from "@/app/api/share/route";
import Action from "@/components/share/action";
import Inputarea from "./inputArea";

const ChatFooter: React.FC = () => {
  // data
  const session = useSession();
  const router = useRouter();
  const [newOpenAI] = useOpenAI();
  const [channel, setChannel] = useChannel();
  const [userInfo, setTokens] = useUserInfo();
  const [, setPremiumOpen] = usePremium();
  const [, setRechargeOpen] = useRecharge();
  const { openai, azure } = useLLM();
  const [inputValue, setInputValue] = React.useState<string>("");
  const LLMOptions = React.useMemo(() => [openai, azure], [openai, azure]);
  const [loadingShare, setLoadingShare] = React.useState(false);

  // ref
  const inputRef = React.useRef<any>(null);
  const actionRef = React.useRef<any>(null);

  const t = useTranslations("chat");
  const tShare = useTranslations("share");
  const tMenu = useTranslations("menu");
  const tPrompt = useTranslations("prompt");
  const tCommon = useTranslations("common");
  const tRes = useTranslations("responseErr");
  const tAuth = useTranslations("auth");
  const tRecharge = useTranslations("recharge");
  const tPremium = useTranslations("premium");
  const scrollToBottom = useScrollToBottom();
  const { decoder } = useStreamDecoder();

  const { run: sendMessage } = useDebounceFn(() => send(), { wait: 200 });
  const { run: generate } = useDebounceFn(() => onGenerate(), { wait: 200 });

  const abortStore = React.useRef<any>({});

  const findChannel = channel.list.find(
    (item) => item.channel_id === channel.activeId
  );
  const loadingChannel = !!findChannel?.channel_loading;

  const handleLogin = () => {
    router.push("/login");
    toast.dismiss();
  };

  const handleCheckExceeded = () => {
    window.open("https://docs.ltopx.com/conversation-limits");
  };

  const handleRecharge = () => {
    toast.dismiss();
    if (!userInfo.license_type) {
      // 开始免费试用
      setPremiumOpen(true);
    } else {
      // 打开充值token界面
      setRechargeOpen(true);
    }
  };

  const onGenerate = () => {
    // stop generate
    if (loadingChannel) {
      toast.error(t("canceled"));

      // abort fetch
      const channel_id = findChannel.channel_id;
      if (!abortStore.current[channel_id]) return;
      abortStore.current[channel_id].abort();
      delete abortStore.current[channel_id];

      setChannel((channel) => {
        const { list, activeId } = channel;
        const findCh = list.find((item) => item.channel_id === activeId);
        if (!findCh) return channel;

        if (!findCh.channel_cost) {
          findCh.channel_cost = {
            tokens: 0,
            usd: 0,
            function_tokens: 0,
            function_usd: 0,
            total_tokens: 0,
            total_usd: 0,
          };
        }

        const findLLM: any = LLMOptions.find(
          (item) => item.value === findCh?.channel_model.type
        );

        const findModelLabel = findLLM.models.find(
          (item: any) => item.value === findCh?.channel_model.name
        );

        const { usedTokens, usedUSD } = calcTokens(
          [
            { role: "system", content: findCh.channel_prompt },
            ...findCh.chat_list.map((item) => ({
              role: item.role,
              content: item.content,
            })),
          ],
          findModelLabel.label
        );

        findCh.channel_cost.tokens = usedTokens;
        findCh.channel_cost.usd = Number(usedUSD.toFixed(5));

        const total_tokens: any = findCh.channel_cost.total_tokens + usedTokens;
        const total_usd = findCh.channel_cost.total_usd + usedUSD;
        findCh.channel_cost.total_tokens = parseInt(total_tokens);
        findCh.channel_cost.total_usd = Number(total_usd.toFixed(5));

        findCh.channel_loading_connect = false;
        findCh.channel_loading = false;

        return channel;
      });

      if (session.data) setTokens(3000);

      return;
    }

    // regenerate
    if (!findChannel?.chat_list.length) return;

    if (findChannel.chat_list.at(-1)?.role !== "assistant") return;
    const findLastIndex = findChannel.chat_list.findLastIndex(
      (item) => item.role === "assistant"
    );
    if (findLastIndex === -1) return;
    const sliceList = findChannel.chat_list.slice(0, findLastIndex);
    setChannel((channel) => {
      const { list, activeId } = channel;
      const findCh = list.find((item) => item.channel_id === activeId);
      if (!findCh) return channel;
      findCh.chat_list = sliceList;
      return channel;
    });
    sendToGPT(sliceList, findChannel?.channel_id as string);
  };

  const send = async () => {
    if (loadingChannel) return;
    if (!inputValue?.trim()) {
      return toast.error(t("enter-message"), {
        id: "empty-message",
        duration: 2000,
      });
    }
    // check model params
    const modelName = findChannel?.channel_model.name;
    const findModel = LLMOptions.find((item) => {
      return item.models.find((val) => val.value === modelName);
    });
    if (!findModel) {
      return toast.error(tRes("10003"), { id: "empty-model", duration: 4000 });
    }

    setInputValue("");
    inputRef.current?.reset();
    let chat_list: ChatItem[] = [];
    setChannel((channel) => {
      const { list, activeId } = channel;
      const findCh = list.find((item) => item.channel_id === activeId);
      if (!findCh) return channel;
      findCh.chat_list.push({
        id: uuidv4(),
        role: "user",
        time: String(+new Date()),
        content: inputValue,
      });
      chat_list = findCh.chat_list;
      return channel;
    });
    if (!chat_list.length) return;
    sendToGPT(chat_list, findChannel?.channel_id as string);
    scrollToBottom();
  };

  const sendToGPT = React.useCallback(
    (chat_list: ChatItem[], channel_id: string) => {
      let modelType: any;
      let modelConfig: any;
      let prompt: any;
      let findCh: ChannelListItem | undefined;

      setChannel((channel) => {
        const { list } = channel;
        findCh = list.find((item) => item.channel_id === channel_id);
        if (!findCh) return channel;

        modelType = findCh?.channel_model.type;
        modelConfig = (newOpenAI as any)[modelType];
        prompt = findCh?.channel_prompt || BASE_PROMPT;
        if (!findCh?.channel_prompt) findCh.channel_prompt = BASE_PROMPT;
        findCh.channel_loading_connect = true;
        findCh.channel_loading = true;
        return channel;
      });

      if (!findCh) return;

      const controller = new AbortController();
      abortStore.current[channel_id] = controller;

      const fetchUrl = `/api/${modelType}`;

      const findLLM: any = LLMOptions.find(
        (item) => item.value === findCh?.channel_model.type
      );

      const findModelLabel = findLLM.models.find(
        (item: any) => item.value === findCh?.channel_model.name
      );

      let params: any = {
        model: findCh?.channel_model.name,
        modelLabel: findModelLabel.label,
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.max_tokens,
        prompt,
      };

      if (modelType === "openai") {
        params.proxy = modelConfig.proxy;
      } else if (modelType === "azure") {
        params.resourceName = modelConfig.resourceName;
      }

      params.chat_list = chat_list.map((item) => ({
        role: item.role,
        content: item.content,
      }));

      fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: modelConfig.apiKey,
        },
        signal: controller.signal,
        body: JSON.stringify(params),
      })
        .then(async (response) => {
          // loading connect end
          setChannel((channel) => {
            const { list } = channel;
            const findCh = list.find((item) => item.channel_id === channel_id);
            if (!findCh) return channel;
            findCh.channel_loading_connect = false;
            return channel;
          });

          if (!response.ok || !response.body) {
            const errRes = await response.json();

            setChannel((channel) => {
              const { list } = channel;
              const findCh = list.find(
                (item) => item.channel_id === channel_id
              );
              if (!findCh) return channel;
              findCh.channel_loading = false;
              return channel;
            });

            let errorMessage = "error";
            if (errRes.error === 10001) {
              return toast(
                () => (
                  <div className="flex gap-4 items-center">
                    {tRes("10001")}
                    <Button type="primary" onClick={handleLogin}>
                      {tAuth("log-in")}
                    </Button>
                  </div>
                ),
                { duration: 5000 }
              );
            } else if (errRes.error === 10002) {
              errorMessage = tRes("10002");
            } else if (errRes.error === 10004) {
              errorMessage = tRes("10004");
            } else if (errRes.error === 10005) {
              return toast(
                () => (
                  <div className="flex gap-4 items-center">
                    {tRes("10005")}
                    <Button type="primary" onClick={handleRecharge}>
                      {userInfo.license_type
                        ? tRecharge("recharge")
                        : tPremium("free-trial")}
                    </Button>
                  </div>
                ),
                { duration: 5000 }
              );
            } else if (errRes.error.code === "context_length_exceeded") {
              return toast(
                () => (
                  <div className="flex gap-4 items-center">
                    {tRes("context_length_exceeded")}
                    <Button type="primary" onClick={handleCheckExceeded}>
                      {tRes("learn-more")}
                    </Button>
                  </div>
                ),
                { duration: 5000 }
              );
            } else {
              errorMessage =
                errRes.msg ||
                errRes?.error?.message ||
                response.statusText ||
                tCommon("service-error");
            }

            toast.error(errorMessage, { duration: 4000 });
            return;
          }

          await decoder(
            response.body.getReader(),
            (content: string) => {
              setChannel((channel) => {
                const { list } = channel;
                const findCh = list.find(
                  (item) => item.channel_id === channel_id
                );
                if (!findCh) return channel;
                const lastItem = findCh.chat_list.at(-1);
                if (!lastItem) return channel;
                if (lastItem.role === "user") {
                  findCh.chat_list.push({
                    id: uuidv4(),
                    role: "assistant",
                    time: String(+new Date()),
                    content,
                  });
                } else {
                  lastItem.content += content;
                }
                return channel;
              });
            },
            (error: any) => {
              toast.error(error?.code || tCommon("service-error"));
            }
          );

          // calc current conversation token
          setChannel((channel) => {
            const { list } = channel;
            findCh = list.find((item) => item.channel_id === channel_id);
            if (!findCh) return channel;

            // end channel loading
            findCh.channel_loading = false;

            if (!findCh.channel_cost) {
              findCh.channel_cost = {
                tokens: 0,
                usd: 0,
                function_tokens: 0,
                function_usd: 0,
                total_tokens: 0,
                total_usd: 0,
              };
            }

            const { usedTokens, usedUSD } = calcTokens(
              [
                { role: "system", content: findCh.channel_prompt },
                ...findCh.chat_list.map((item) => ({
                  role: item.role,
                  content: item.content,
                })),
              ],
              findModelLabel.label
            );

            findCh.channel_cost.tokens = usedTokens;
            findCh.channel_cost.usd = Number(usedUSD.toFixed(5));

            const total_tokens: any =
              findCh.channel_cost.total_tokens + usedTokens;
            const total_usd = findCh.channel_cost.total_usd + usedUSD;
            findCh.channel_cost.total_tokens = parseInt(total_tokens);
            findCh.channel_cost.total_usd = Number(total_usd.toFixed(5));

            // get conversation title
            if (!findCh.channel_name) {
              const newParams = { ...params, chat_list: findCh.chat_list };
              getChannelNameByGPT(
                channel_id,
                newParams,
                fetchUrl,
                modelConfig.apiKey,
                findModelLabel
              );
            }

            return channel;
          });

          if (session.data) setTokens(3000);
        })
        .catch((error) => {
          console.log(error, "sendGPT error");
          setChannel((channel) => {
            const { list } = channel;
            const findCh = list.find((item) => item.channel_id === channel_id);
            if (!findCh) return channel;
            findCh.channel_loading_connect = false;
            findCh.channel_loading = false;
            return channel;
          });
        });
    },
    [channel]
  );

  const getChannelNameByGPT = (
    channel_id: string,
    params: any,
    fetchUrl: string,
    Authorization: string,
    findModelLabel: any
  ) => {
    const newParams = JSON.parse(JSON.stringify(params));
    newParams.chat_list.push({
      role: "system",
      content: tPrompt("get-title"),
    });

    newParams.chat_list = newParams.chat_list.map((item: any) => ({
      role: item.role,
      content: item.content,
    }));

    delete newParams.prompt;

    fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization,
      },
      body: JSON.stringify(newParams),
    }).then(async (response) => {
      if (!response.ok || !response.body) return;
      await decoder(
        response.body.getReader(),
        (content: string) => {
          setChannel((channel) => {
            const findCh = channel.list.find(
              (e) => e.channel_id === channel_id
            );
            if (!findCh) return channel;
            findCh.channel_name += content;
            return channel;
          });
        },
        () => {
          toast.error(tCommon("service-error"));
        }
      );

      setChannel((channel) => {
        const findCh = channel.list.find((e) => e.channel_id === channel_id);
        if (!findCh) return channel;

        const { usedTokens, usedUSD } = calcTokens(
          [
            ...newParams.chat_list,
            { role: "assistant", content: findCh.channel_name },
          ],
          findModelLabel.label
        );

        findCh.channel_cost.function_tokens += usedTokens;
        const function_usd = findCh.channel_cost.function_usd + usedUSD;
        findCh.channel_cost.function_usd = Number(function_usd.toFixed(5));

        const total_tokens: any = findCh.channel_cost.total_tokens + usedTokens;
        const total_usd = findCh.channel_cost.total_usd + usedUSD;
        findCh.channel_cost.total_tokens = parseInt(total_tokens);
        findCh.channel_cost.total_usd = Number(total_usd.toFixed(5));

        return channel;
      });

      if (session.data) setTokens(3000);
    });
  };

  const clearNowConversation = () => {
    setChannel((channel) => {
      const { activeId, list } = channel;
      const findCh = list.find((item) => item.channel_id === activeId);
      if (!findCh) return channel;
      findCh.channel_icon = "RiChatSmile2Line";
      findCh.chat_list = [];
      findCh.channel_name = "";
      findCh.channel_prompt = BASE_PROMPT;
      findCh.channel_cost = {
        tokens: 0,
        usd: 0,
        function_tokens: 0,
        function_usd: 0,
        total_tokens: 0,
        total_usd: 0,
      };
      findCh.channel_loading_connect = false;
      findCh.channel_loading = false;
      return channel;
    });
  };

  // share functions
  const handleShare = () => {
    if (!findChannel) return;

    const findModels =
      LLMOptions.find((e) => e.value === findChannel.channel_model.type)
        ?.models || [];

    const findType = findModels.find(
      (e) => e.value === findChannel.channel_model.name
    )?.label;

    if (!findType) {
      return toast.error(tShare("model-error"), { id: "model-error" });
    }

    const params: IShare = {
      channel_model: {
        supplier: findChannel.channel_model.type,
        type: findType,
      },
      channel_name: findChannel.channel_name,
      channel_prompt: findChannel.channel_prompt,
      chat_content: findChannel.chat_list,
    };

    setLoadingShare(true);
    fetch("/api/share", {
      method: "POST",
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error || !res.data?.id) {
          return toast.error(res.msg || tCommon("service-error"), {
            id: "share-error",
          });
        }
        toast.success(tShare("share-success"), { id: "share-success" });
        actionRef.current?.init(res.data.id);
      })
      .finally(() => {
        setLoadingShare(false);
      });
  };

  React.useEffect(() => {
    setInputValue("");
    inputRef.current?.reset();
    if (!isMobile()) inputRef.current?.focus();
  }, [channel.activeId]);

  return (
    <>
      <div
        className={cn(
          "bg-gradient-to-b from-transparent w-full px-5 pb-5 bottom-0 left-0 absolute",
          "via-gray-100 to-gray-100",
          "dark:via-neutral-900 dark:to-neutral-900"
        )}
      >
        <div className="flex py-2 gap-3 justify-center items-center">
          {!!findChannel?.chat_list?.length && (
            <>
              <Button
                className="group"
                size="sm"
                type="outline"
                onClick={generate}
                leftIcon={
                  loadingChannel ? (
                    <BsStop size={20} />
                  ) : (
                    <AiOutlineRedo size={20} className="group:hover:bg-[red]" />
                  )
                }
              >
                {loadingChannel ? t("stop-generate") : t("re-generate")}
              </Button>
              <Button
                type="outline"
                leftIcon={<AiOutlineShareAlt size={18} />}
                loading={loadingShare}
                onClick={handleShare}
              >
                {tShare("share")}
              </Button>
            </>
          )}
          <Link
            className="underline text-sm hidden md:block"
            target="_blank"
            href="https://docs.ltopx.com"
          >
            {tCommon("docs")}
          </Link>
        </div>

        <div className="flex">
          <div className="flex items-end">
            <Confirm
              disabled={loadingChannel}
              title={tMenu("clear-all-conversation")}
              content={t("clear-current-conversation")}
              trigger={
                <div
                  className={cn(
                    "w-8 h-[2.75rem] flex items-center cursor-pointer transition-colors",
                    "text-black/90 hover:text-sky-400",
                    "dark:text-white/90 dark:hover:text-sky-400/90"
                  )}
                >
                  {loadingChannel ? (
                    <AiOutlineLoading className="animate-spin" size={24} />
                  ) : (
                    <AiOutlineClear size={24} />
                  )}
                </div>
              }
              onOk={clearNowConversation}
            />
          </div>
          <Inputarea
            ref={inputRef}
            value={inputValue}
            loading={loadingChannel}
            onChange={setInputValue}
            onSubmit={sendMessage}
          />
        </div>
      </div>
      <Action ref={actionRef} />
    </>
  );
};

export default ChatFooter;
