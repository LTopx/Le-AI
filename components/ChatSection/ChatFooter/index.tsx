import * as React from "react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { v4 as uuidv4 } from "uuid";
import { useChatLoading, useChatAbort } from "@/state";
import type { ChatItem } from "@/hooks/useChannel";
import {
  AiOutlineSend,
  AiOutlineLoading,
  AiOutlineRedo,
  AiOutlineClear,
} from "react-icons/ai";
import { BsStop } from "react-icons/bs";
import { useDebounceFn } from "ahooks";
import toast from "react-hot-toast";
import { useChannel, useOpenAIKey, useProxy, useStreamDecoder } from "@/hooks";
import { useScrollToBottom } from "@/components";
import { isMobile } from "@/utils";

const ChatFooter: React.FC = () => {
  // data
  const [openAIKey] = useOpenAIKey();
  const [proxyUrl] = useProxy();
  const [channel, setChannel] = useChannel();
  const [inputValue, setInputValue] = React.useState<string>("");
  const [isFocus, setIsFocus] = React.useState<boolean>(false);
  const setLoadingStart = useChatLoading((state) => state.updateStart);
  const loadingFinish = useChatLoading((state) => state.loadingResponseFinish);
  const setLoadingFinish = useChatLoading((state) => state.updateFinish);
  const chatAbort = useChatAbort((state) => state.abort);
  const setChatAbort = useChatAbort((state) => state.update);

  // ref
  const inputRef = React.useRef<any>(null);

  const { t } = useTranslation("chat");
  const { t: tPrompt } = useTranslation("prompt");
  const scrollToBottom = useScrollToBottom();
  const { decoder } = useStreamDecoder();

  const { run: sendMessage } = useDebounceFn(() => send(), { wait: 200 });
  const { run: generate } = useDebounceFn(() => onGenerate(), { wait: 200 });

  const findChannel = channel.list.find(
    (item) => item.channel_id === channel.activeId
  );

  const placeholder = t("type-message");

  const onInput = () => {
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    inputRef.current.style.overflow =
      inputRef.current.getBoundingClientRect().height ===
      inputRef.current.scrollHeight
        ? "hidden"
        : "auto";
  };

  const onChange = (e: any) => setInputValue(e.target.value);

  const onKeyDown = (e: any) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetInput = () => {
    inputRef.current.value = "";
    onInput();
    setInputValue("");
  };

  // stop generate or regenerate
  const onGenerate = () => {
    if (loadingFinish) {
      toast.error(t("canceled"));
      chatAbort?.abort();
      setLoadingStart(false);
      setLoadingFinish(false);
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
    if (loadingFinish) return;
    if (!inputValue.trim()) {
      return toast.error(t("enter-message"), {
        id: "empty-message",
        duration: 2000,
      });
    }
    resetInput();
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
      setLoadingStart(true);
      setLoadingFinish(true);

      const controller = new AbortController();
      setChatAbort(controller);

      fetch("/api/gpt", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: openAIKey,
        },
        signal: controller.signal,
        body: JSON.stringify({
          proxyUrl,
          chat_list: chat_list.map((item) => ({
            role: item.role,
            content: item.content,
          })),
        }),
      })
        .then(async (response) => {
          setLoadingStart(false);
          if (!response.ok || !response.body) {
            setLoadingFinish(false);
            if (!response.ok) toast.error(response.statusText);
            return;
          }
          let channel_id = "";
          let channel_name = "";
          let channel_chat_list: ChatItem[] = [];

          await decoder(response.body.getReader(), (content: string) => {
            setChannel((channel) => {
              const findChannel = channel.list.find(
                (item) => item.channel_id === channel.activeId
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
          });
          setLoadingFinish(false);
          // get gpt title
          if (!channel_name) getChannelNameByGPT(channel_id, channel_chat_list);
        })
        .catch(() => {
          setLoadingStart(false);
          setLoadingFinish(false);
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
    fetch("/api/gpt", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: openAIKey,
      },
      body: JSON.stringify({ proxyUrl, chat_list }),
    }).then(async (response) => {
      if (!response.ok || !response.body) return;
      decoder(response.body.getReader(), (content: string) => {
        setChannel((channel) => {
          const findChannel = channel.list.find((e) => e.channel_id === id);
          if (!findChannel) return channel;
          findChannel.channel_name += content;
          return channel;
        });
      });
    });
  };

  const clearNowConversation = () => {
    const confirmMsg = t("clear-current-conversation");
    if (!confirm(confirmMsg)) return;
    setChannel((channel) => {
      const { activeId, list } = channel;
      const findChannel = list.find((item) => item.channel_id === activeId);
      if (!findChannel) return channel;
      findChannel.chat_list = [];
      findChannel.channel_name = "";
      return channel;
    });
  };

  React.useEffect(() => {
    resetInput();
    if (!isMobile()) inputRef.current?.focus();
  }, [channel.activeId]);

  return (
    <div className="bg-gradient-to-b from-transparent via-white to-white w-full px-5 pb-5 bottom-0 left-0 absolute">
      {!!findChannel?.chat_list?.length && (
        <div className="flex py-3 justify-center items-center">
          <div
            className={classNames(
              "bg-white border rounded-md flex gap-2 items-center cursor-pointer border-[#d9d9d9] text-sm py-2 px-4 transition-all shadow-[0_2px_0_rgba(0,0,0,0.02)] select-none",
              "hover:text-[#4096ff] hover:border-[#4096ff] active:text-[#0958d9] active:border-[#0958d9]"
            )}
            onClick={generate}
          >
            {loadingFinish ? (
              <>
                <BsStop size={20} /> {t("stop-generate")}
              </>
            ) : (
              <>
                <AiOutlineRedo size={20} />
                {t("re-generate")}
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex">
        <div className="flex items-end">
          <div
            onClick={clearNowConversation}
            className="w-8 h-[2.75rem] flex items-center cursor-pointer transition-colors hover:text-[#678fff]"
          >
            <AiOutlineClear size={24} />
          </div>
        </div>
        <div
          className={classNames(
            "flex-1 bg-white border rounded-md transition-colors relative hover:border-[#4096ff] pr-5",
            {
              "border-[#4096ff] shadow-[0_0_0_2px_rgba(5,145,255,.1)]": isFocus,
            }
          )}
        >
          <textarea
            className="bg-transparent rounded-md h-full outline-none text-sm w-full max-h-56 py-3 px-4 resize-none block"
            ref={inputRef}
            placeholder={placeholder}
            rows={1}
            onInput={onInput}
            onChange={onChange}
            value={inputValue}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onKeyDown={onKeyDown}
          />
          {loadingFinish ? (
            <div className="rounded-md text-primary cursor-pointer flex h-7 transition-colors right-2.5 bottom-2 w-7 absolute justify-center items-center hover:bg-[#e3e5e5]">
              <AiOutlineLoading size={24} className="animate-spin" />
            </div>
          ) : (
            <div
              onClick={sendMessage}
              className={classNames(
                "rounded-md cursor-pointer text-disabled flex h-7 transition-colors right-2.5 bottom-2 w-7 absolute justify-center items-center hover:bg-[#e3e5e5]",
                inputValue ? "!text-primary" : ""
              )}
            >
              <AiOutlineSend size={24} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatFooter;
