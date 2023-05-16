import * as React from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { v4 as uuidv4 } from "uuid";
import type { ChatItem } from "@/hooks/useChannel";
import { AiOutlineRedo, AiOutlineClear } from "react-icons/ai";
import { BsStop } from "react-icons/bs";
import { useDebounceFn } from "ahooks";
import toast from "react-hot-toast";
import { useChannel, useOpenAI, useStreamDecoder, useChat } from "@/hooks";
import Confirm from "@/components/ui/Confirm";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { useScrollToBottom } from "@/components/scrollToBottoms";
import { isMobile, getReadableStream } from "@/lib";
import { PROMPT_BASE } from "@/prompt";

const ChatFooter: React.FC = () => {
  // data
  const [newOpenAI] = useOpenAI();
  const [channel, setChannel] = useChannel();
  const {
    loadingResponseFinish,
    abort: chatAbort,
    updateStart,
    updateFinish,
    updateAbort,
  } = useChat();
  const [inputValue, setInputValue] = React.useState<string>("");

  // ref
  const inputRef = React.useRef<any>(null);

  const t = useTranslations("chat");
  const tMenu = useTranslations("menu");
  const tPrompt = useTranslations("prompt");
  const tCommon = useTranslations("common");
  const tRes = useTranslations("responseErr");
  const scrollToBottom = useScrollToBottom();
  const { decoder } = useStreamDecoder();

  const { run: sendMessage } = useDebounceFn(() => send(), { wait: 200 });
  const { run: generate } = useDebounceFn(() => onGenerate(), { wait: 200 });

  const findChannel = channel.list.find(
    (item) => item.channel_id === channel.activeId
  );

  // stop generate or regenerate
  const onGenerate = () => {
    if (loadingResponseFinish) {
      toast.error(t("canceled"));
      chatAbort?.abort();
      updateStart(false);
      updateFinish(false);
      return;
    }

    const findChannel = channel.list.find(
      (item) => item.channel_id === channel.activeId
    );
    if (!findChannel?.chat_list.length) return;
    if (findChannel.chat_list.at(-1)?.role !== "assistant") return;
    const findLastIndex = findChannel.chat_list.findLastIndex(
      (item) => item.role === "assistant"
    );
    if (findLastIndex === -1) return;
    const sliceList = findChannel.chat_list.slice(0, findLastIndex);
    setChannel((channel) => {
      const { list, activeId } = channel;
      const findChannel = list.find((item) => item.channel_id === activeId);
      if (!findChannel) return channel;
      findChannel.chat_list = sliceList;
      return channel;
    });
    sendToGPT(sliceList);
  };

  const send = async () => {
    if (loadingResponseFinish) return;
    if (!inputValue?.trim()) {
      return toast.error(t("enter-message"), {
        id: "empty-message",
        duration: 2000,
      });
    }
    setInputValue("");
    inputRef.current?.reset();
    let chat_list: ChatItem[] = [];
    setChannel((channel) => {
      const { list, activeId } = channel;
      const findChannel = list.find((item) => item.channel_id === activeId);
      if (!findChannel) return channel;
      findChannel.chat_list.push({
        id: uuidv4(),
        role: "user",
        time: String(+new Date()),
        content: inputValue,
      });
      chat_list = findChannel.chat_list;
      return channel;
    });
    sendToGPT(chat_list);
    scrollToBottom();
  };

  const sendToGPT = React.useCallback(
    (chat_list: ChatItem[]) => {
      const modelType: any = findChannel?.channel_model.type;
      const modelConfig = (newOpenAI as any)[modelType];
      const prompt = findChannel?.channel_prompt || PROMPT_BASE;
      if (!findChannel?.channel_prompt) {
        setChannel((channel) => {
          const { list, activeId } = channel;
          const findCh = list.find((item) => item.channel_id === activeId);
          if (!findCh) return channel;
          findCh.channel_prompt = PROMPT_BASE;
          return channel;
        });
      }

      updateStart(true);
      updateFinish(true);

      const controller = new AbortController();
      updateAbort(controller);

      const fetchUrl = `/api/${modelType}`;

      let params: any = {};
      if (modelType === "openai") {
        params = {
          model: findChannel?.channel_model.name,
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.max_tokens,
          prompt,
          proxy: modelConfig.proxy,
        };
      } else if (modelType === "azure") {
        params = {
          model: findChannel?.channel_model.name,
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.max_tokens,
          prompt,
          resourceName: modelConfig.resourceName,
        };
      }

      params.chat_list = chat_list.map((item) => ({
        role: item.role,
        content: item.content,
      }));

      fetch(fetchUrl, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: modelConfig.apiKey,
        },
        signal: controller.signal,
        body: JSON.stringify(params),
      })
        .then(async (response) => {
          updateStart(false);
          if (!response.ok || !response.body) {
            updateFinish(false);
            if (!response.ok) {
              const stream = await getReadableStream(response.body);
              const streamRes: any = JSON.parse(stream as string);

              let errorMessage = "";

              if (streamRes.error === 10001) {
                errorMessage = tRes("10001");
              } else if (streamRes.error === 10002) {
                errorMessage = tRes("10002");
              } else if (streamRes.error === 10003) {
                errorMessage = tRes("10003");
              } else {
                errorMessage = response.statusText || tCommon("service-error");
              }

              toast.error(errorMessage, { duration: 4000 });
            }
            return;
          }
          let channel_id = "";
          let channel_name = "";
          let channel_chat_list: ChatItem[] = [];

          await decoder(
            response.body.getReader(),
            (content: string) => {
              setChannel((channel) => {
                const { list, activeId } = channel;
                const findChannel = list.find(
                  (item) => item.channel_id === activeId
                );
                if (!findChannel) return channel;
                const lastItem = findChannel.chat_list.at(-1);
                if (!lastItem) return channel;
                if (lastItem.role === "user") {
                  findChannel.chat_list.push({
                    id: uuidv4(),
                    role: "assistant",
                    time: String(+new Date()),
                    content,
                  });
                } else {
                  lastItem.content += content;
                }
                channel_name = findChannel.channel_name;
                channel_id = findChannel.channel_id;
                channel_chat_list = findChannel.chat_list;
                return channel;
              });
            },
            (error: any) => {
              toast.error(error?.code || tCommon("service-error"));
              updateStart(false);
              updateFinish(false);
            }
          );
          updateFinish(false);
          // get gpt title
          if (!channel_name) getChannelNameByGPT(channel_id, channel_chat_list);
        })
        .catch(() => {
          updateStart(false);
          updateFinish(false);
        });
    },
    [channel]
  );

  const getChannelNameByGPT = (id: string, list: ChatItem[]) => {
    const chat_list = list.map((item) => ({
      role: item.role,
      content: item.content,
    }));
    chat_list.push({
      role: "system",
      content: tPrompt("get-title"),
    });

    const modelType: any = findChannel?.channel_model.type;
    const modelConfig = (newOpenAI as any)[modelType];

    const fetchUrl = `/api/${modelType}`;

    let params: any = {};
    if (modelType === "openai") {
      params = {
        model: findChannel?.channel_model.name,
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.max_tokens,
        proxy: modelConfig.proxy,
      };
    } else if (modelType === "azure") {
      params = {
        model: findChannel?.channel_model.name,
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.max_tokens,
        resourceName: modelConfig.resourceName,
      };
    }

    params.chat_list = chat_list;

    fetch(fetchUrl, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: modelConfig.apiKey,
      },
      body: JSON.stringify(params),
    }).then(async (response) => {
      if (!response.ok || !response.body) return;
      decoder(
        response.body.getReader(),
        (content: string) => {
          setChannel((channel) => {
            const findChannel = channel.list.find((e) => e.channel_id === id);
            if (!findChannel) return channel;
            findChannel.channel_name += content;
            return channel;
          });
        },
        () => {
          toast.error(tCommon("service-error"));
        }
      );
    });
  };

  const clearNowConversation = () => {
    setChannel((channel) => {
      const { activeId, list } = channel;
      const findChannel = list.find((item) => item.channel_id === activeId);
      if (!findChannel) return channel;
      findChannel.channel_icon = "RiChatSmile2Line";
      findChannel.chat_list = [];
      findChannel.channel_name = "";
      findChannel.channel_prompt = "";
      return channel;
    });
  };

  React.useEffect(() => {
    setInputValue("");
    inputRef.current?.reset();
    if (!isMobile()) inputRef.current?.focus();
  }, [channel.activeId]);

  return (
    <div
      className={clsx(
        "bg-gradient-to-b from-transparent w-full px-5 pb-5 bottom-0 left-0 absolute",
        "via-gray-100 to-gray-100",
        "dark:via-neutral-900 dark:to-neutral-900"
      )}
    >
      {!!findChannel?.chat_list?.length && (
        <div className="flex py-3 justify-center items-center">
          <Button
            size="sm"
            type="outline"
            onClick={generate}
            leftIcon={
              loadingResponseFinish ? (
                <BsStop size={20} />
              ) : (
                <AiOutlineRedo size={20} />
              )
            }
          >
            {loadingResponseFinish ? t("stop-generate") : t("re-generate")}
          </Button>
        </div>
      )}

      <div className="flex">
        <div className="flex items-end">
          <Confirm
            title={tMenu("clear-all-conversation")}
            content={t("clear-current-conversation")}
            trigger={
              <div
                className={clsx(
                  "w-8 h-[2.75rem] flex items-center cursor-pointer transition-colors",
                  "text-black/90 hover:text-sky-400",
                  "dark:text-white/90 dark:hover:text-sky-400/90"
                )}
              >
                <AiOutlineClear size={24} />
              </div>
            }
            onOk={clearNowConversation}
          />
        </div>
        <Textarea
          ref={inputRef}
          value={inputValue}
          onChange={setInputValue}
          onSubmit={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatFooter;
