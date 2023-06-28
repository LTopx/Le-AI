import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { calcTokens } from "@/lib";
import { Button } from "@/components/ui";
import {
  useChannel,
  useOpenAI,
  useLLM,
  useUserInfo,
  usePremium,
  useRecharge,
  useStreamDecoder,
  useScrollToBottom,
  BASE_PROMPT,
} from "@/hooks";
import type { ChatItem, ChannelListItem } from "@/hooks";

export const useChatGPT = () => {
  const session = useSession();
  const [, setChannel] = useChannel();
  const router = useRouter();
  const [newOpenAI] = useOpenAI();
  const [userInfo, setTokens] = useUserInfo();
  const [, setPremiumOpen] = usePremium();
  const [, setRechargeOpen] = useRecharge();
  const { decoder } = useStreamDecoder();
  const { scrollToBottom } = useScrollToBottom();
  const { openai, azure } = useLLM();
  const LLMOptions = React.useMemo(() => [openai, azure], [openai, azure]);

  const tRes = useTranslations("responseErr");
  const tAuth = useTranslations("auth");
  const tRecharge = useTranslations("recharge");
  const tPremium = useTranslations("premium");
  const tCommon = useTranslations("common");
  const tPrompt = useTranslations("prompt");

  const abortStore = React.useRef<any>({});

  const handleLogin = () => {
    router.push("/login");
    toast.dismiss();
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

  const handleCheckExceeded = () => {
    window.open("https://docs.ltopx.com/conversation-limits");
  };

  const send = (chat_list: ChatItem[], channel_id: string) => {
    let modelType: any;
    let modelConfig: any;
    let prompt: any;
    let findCh: ChannelListItem | undefined;

    setChannel((channel) => {
      const { list } = channel;
      findCh = list.find((item) => item.channel_id === channel_id);
      if (!findCh) return channel;

      modelType = findCh.channel_model.type;
      modelConfig = (newOpenAI as any)[modelType];
      prompt = findCh.channel_prompt || BASE_PROMPT;
      if (!findCh.channel_prompt) findCh.channel_prompt = BASE_PROMPT;
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
            const findCh = list.find((item) => item.channel_id === channel_id);
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
              scrollToBottom();
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
            getChannelName(
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
  };

  const getChannelName = (
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

  const abort = (channel_id: string) => {
    if (!abortStore.current[channel_id]) return;
    abortStore.current[channel_id].abort();
    delete abortStore.current[channel_id];

    setChannel((channel) => {
      const { list } = channel;
      const findCh = list.find((item) => item.channel_id === channel_id);
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
        (item) => item.value === findCh.channel_model.type
      );

      const findModelLabel = findLLM.models.find(
        (item: any) => item.value === findCh.channel_model.name
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
  };

  return { send, abort };
};
