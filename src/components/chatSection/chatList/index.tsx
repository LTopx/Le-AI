"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useDateFormat } from "l-hooks";
import CopyIcon from "@/components/site/copyIcon";
import ChatContent from "@/components/chatContent";
import Icon from "@/components/icon";
import { Confirm, Button } from "@/components/ui";
import { cn, calcTokens } from "@/lib";
import type { supportModelType } from "@/lib/gpt-tokens";
import {
  useChannel,
  useLLM,
  useTTS,
  useUserInfo,
  useTTSOpen,
  useScrollToBottom,
} from "@/hooks";
import { useChatGPT } from "@/hooks/useChatGPT";
import type { ChatItem } from "@/hooks";
import Configure from "../../chatConfigure";
import TTSHandler from "./ttsHandler";

const ChatList: React.FC = () => {
  const session = useSession();
  const { format } = useDateFormat();
  const { send } = useChatGPT();
  const { azure } = useLLM();
  const { speak, pause } = useTTS();
  const [channel, setChannel] = useChannel();
  const [userInfo] = useUserInfo();
  const [, setTTSOpen] = useTTSOpen();
  const { scrollToBottom } = useScrollToBottom();

  const t = useTranslations("chat");

  const backupIdRef = React.useRef<string | null>(null);

  const user = session.data?.user;

  const findChannel = channel.list.find(
    (item) => item.channel_id === channel.activeId
  );

  const chatList = findChannel?.chat_list || [];

  const renderAssistantIcon = () => {
    if (findChannel?.channel_model.type === "openai") {
      return (
        <div className="rounded-full flex bg-[#20a37f] h-8 w-8 justify-center items-center">
          <Icon icon="openai" size={20} className="text-white" />
        </div>
      );
    }
    if (findChannel?.channel_model.type === "azure") {
      return (
        <div className="rounded-full flex bg-sky-200/70 h-8 w-8 justify-center items-center">
          <Icon icon="azure" size={20} className="text-white" />
        </div>
      );
    }

    return null;
  };

  const onDelete = (item: ChatItem) => {
    const { id } = item;
    setChannel((channel) => {
      const { list, activeId } = channel;
      const findCh = list.find((item) => item.channel_id === activeId);
      if (!findCh) return channel;
      findCh.chat_list = findCh.chat_list.filter((item) => item.id !== id);

      const channel_model = findCh.channel_model;

      let calcModel = channel_model.name;
      const findAzureModel = azure.models.find(
        (item) => item.value === calcModel
      );
      if (findAzureModel) calcModel = findAzureModel.label;

      const messages = findCh.chat_list.map((item) => ({
        role: item.role,
        content: item.content,
      }));

      const isPlus =
        channel_model.type === "openai" &&
        (channel_model.name === "gpt-3.5-turbo" ||
          channel_model.name === "gpt-3.5-turbo-0613");

      const { usedTokens, usedUSD } = calcTokens(
        messages,
        calcModel as supportModelType,
        isPlus
      );

      // Only updates the tokens required to process the entire content of the current session,
      // without affecting the tokens that have already been consumed,
      // and therefore does not affect the value of total_tokens.
      findCh.channel_cost.tokens = usedTokens;
      findCh.channel_cost.usd = Number(usedUSD.toFixed(5));

      return channel;
    });
  };

  const onRegenerate = (item: ChatItem) => {
    if (!findChannel) return;
    const { channel_loading, channel_loading_connect, chat_list } = findChannel;

    if (channel_loading || channel_loading_connect) return;

    const findIndex = chat_list.findIndex((val) => val.id === item.id);

    let arr: ChatItem[] = [];

    if (item.role === "assistant") {
      arr = chat_list.slice(0, findIndex);
    } else if (item.role === "user") {
      arr = chat_list.slice(0, findIndex + 1);
    }
    if (!arr.length) return;

    setChannel((channel) => {
      const { list, activeId } = channel;
      const findCh = list.find((item) => item.channel_id === activeId);
      if (!findCh) return channel;
      findCh.chat_list = arr;
      return channel;
    });

    send(arr, findChannel.channel_id);
  };

  const onRead = (item: ChatItem, channel_id: string) => {
    setChannel((channel) => {
      const { list } = channel;
      const findCh = list.find((item) => item.channel_id === channel_id);
      if (!findCh) return channel;
      const findChat = findCh.chat_list.find((val) => {
        val.tts_loading = false;
        return val.id === item.id;
      });
      if (!findChat) return channel;
      findChat.tts_loading = true;
      return channel;
    });

    speak(item.content, () => {
      setChannel((channel) => {
        const { list } = channel;
        const findCh = list.find((item) => item.channel_id === channel_id);
        if (!findCh) return channel;
        const findChat = findCh.chat_list.find((val) => val.id === item.id);
        if (!findChat) return channel;
        findChat.tts_loading = false;
        return channel;
      });
    });
  };

  const onPause = (item: ChatItem, channel_id: string) => {
    setChannel((channel) => {
      const { list } = channel;
      const findCh = list.find((item) => item.channel_id === channel_id);
      if (!findCh) return channel;
      const findChat = findCh.chat_list.find((val) => val.id === item.id);
      if (!findChat) return channel;
      findChat.tts_loading = false;
      return channel;
    });
    pause();
  };

  const onTTSSetting = () => setTTSOpen(true);

  React.useEffect(() => {
    if (backupIdRef.current) {
      const findNowCh = channel.list.find(
        (item) => item.channel_id === backupIdRef.current
      );
      if (findNowCh) {
        const findTTS = findNowCh.chat_list.find((val) => val.tts_loading);
        if (findTTS) onPause(findTTS, backupIdRef.current);
      }
    }

    backupIdRef.current = channel.activeId;
    scrollToBottom();
  }, [channel.activeId]);

  React.useEffect(() => {
    return () => {
      setChannel((channel) => {
        const { list, activeId } = channel;
        const findCh = list.find((item) => item.channel_id === activeId);
        if (!findCh) return channel;
        const findTTS = findCh.chat_list.find((val) => val.tts_loading);
        if (findTTS) {
          findTTS.tts_loading = false;
          pause();
        }
        return channel;
      });
    };
  }, []);

  return (
    <>
      {!chatList.length && <Configure />}
      <div className="flex flex-col mt-5 gap-5">
        {chatList.map((item, index) => (
          <div
            key={item.id}
            className={cn("flex gap-3 group", {
              "mt-12": index === 0,
            })}
          >
            <div>
              {item.role === "assistant" && renderAssistantIcon()}
              {/* {item.role === "assistant" && (
                <div className="rounded-full flex bg-sky-200/70 h-8 w-8 justify-center items-center">
                  <Icon icon="azure" size={20} className="text-white" />
                </div>
              )} */}
              {item.role === "user" && (
                <div
                  className={cn(
                    "rounded-full flex h-8 w-8 justify-center items-center",
                    "bg-black/25 dark:bg-slate-50"
                  )}
                >
                  {user?.image ? (
                    <Image
                      className="rounded-full"
                      src={user.image}
                      alt="Avatar"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <Icon
                      icon="user_3_fill"
                      className="text-white dark:text-neutral-600"
                    />
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex text-sm text-neutral-500 gap-4 items-center dark:text-neutral-300/90">
                {format(Number(item.time), "MM-DD HH:mm:ss")}
                <div className="flex opacity-0 transition-opacity gap-1.5 group-hover:opacity-100">
                  <Button type="outline" size="xs" className="rounded-full">
                    <CopyIcon size={16} content={item.content} />
                  </Button>
                  <Confirm
                    title={t("delete-chat")}
                    content={t("delete-chat-tip")}
                    trigger={
                      <Button size="xs" type="outline" className="rounded-full">
                        <Icon icon="delete_2_line" size={16} />
                      </Button>
                    }
                    onOk={() => onDelete(item)}
                  />
                  <Button
                    size="xs"
                    type="outline"
                    className="rounded-full"
                    onClick={() => onRegenerate(item)}
                  >
                    <Icon icon="refresh_3_line" size={16} />
                  </Button>
                </div>
              </div>
              <div
                className={cn(
                  "self-start py-2.5 px-3 rounded-lg relative border border-transparent group/item",
                  { "bg-blue-200/70 dark:bg-blue-900": item.role === "user" },
                  {
                    "bg-neutral-200/60 dark:bg-neutral-800/90 dark:border-neutral-600/60":
                      item.role === "assistant",
                  }
                )}
              >
                <ChatContent data={item} />

                <TTSHandler
                  data={item}
                  license_type={userInfo.license_type}
                  onRead={() => onRead(item, findChannel?.channel_id as string)}
                  onPause={() =>
                    onPause(item, findChannel?.channel_id as string)
                  }
                  onTTSSetting={onTTSSetting}
                />
              </div>
            </div>
          </div>
        ))}
        {!!findChannel?.channel_loading_connect && (
          <div>
            <Icon
              icon="loading_line"
              size={24}
              className="ml-11 animate-spin text-sky-400 dark:text-sky-400/90"
            />
          </div>
        )}
      </div>
      <div className="h-32 overflow-hidden" />
    </>
  );
};

export default ChatList;
