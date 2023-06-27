import * as React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useDateFormat } from "l-hooks";
import { BsFillPlayFill, BsStopFill } from "react-icons/bs";
import CopyIcon from "@/components/site/copyIcon";
import ChatContent from "@/components/chatContent";
import { Confirm, Divider, Button, Link } from "@/components/ui";
import { useScrollToBottom } from "@/components/scrollToBottoms";
import {
  AiOutlineLoading,
  AiOutlineDelete,
  AiOutlineUser,
} from "react-icons/ai";
import { cn, calcTokens } from "@/lib";
import type { supportModelType } from "@/lib/gpt-tokens";
import { useChannel, useLLM, useTTS, useUserInfo, useTTSOpen } from "@/hooks";
import type { ChatItem } from "@/hooks";
import Configure from "../../chatConfigure";

const ChatList: React.FC = () => {
  const session = useSession();
  const { format } = useDateFormat();
  const { azure } = useLLM();
  const { speak, pause } = useTTS();
  const [channel, setChannel] = useChannel();
  const [userInfo] = useUserInfo();
  const [, setTTSOpen] = useTTSOpen();
  const t = useTranslations("chat");

  const backupIdRef = React.useRef<string | null>(null);

  const user = session.data?.user;

  const findChannel = channel.list.find(
    (item) => item.channel_id === channel.activeId
  );

  const chatList = findChannel?.chat_list || [];

  const scrollToBottom = useScrollToBottom();

  const onDelete = (item: ChatItem) => {
    const { id } = item;
    setChannel((channel) => {
      const { list, activeId } = channel;
      const findChannel = list.find((item) => item.channel_id === activeId);
      if (!findChannel) return channel;
      findChannel.chat_list = findChannel.chat_list.filter(
        (item) => item.id !== id
      );

      let calcModel = findChannel.channel_model.name;
      const findAzureModel = azure.models.find(
        (item) => item.value === calcModel
      );
      if (findAzureModel) calcModel = findAzureModel.label;

      const messages = findChannel.chat_list.map((item) => ({
        role: item.role,
        content: item.content,
      }));

      const { usedTokens, usedUSD } = calcTokens(
        messages,
        calcModel as supportModelType
      );

      // Only updates the tokens required to process the entire content of the current session,
      // without affecting the tokens that have already been consumed,
      // and therefore does not affect the value of total_tokens.
      findChannel.channel_cost.tokens = usedTokens;
      findChannel.channel_cost.usd = Number(usedUSD.toFixed(5));

      return channel;
    });
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

  return (
    <>
      {!chatList.length && <Configure />}
      <div className="flex flex-col mt-5 gap-5">
        {chatList.map((item, index) => (
          <div
            key={item.id}
            className={cn("flex gap-3 group", { "mt-12": index === 0 })}
          >
            <div>
              {item.role === "assistant" && (
                <div className="rounded-full flex bg-[#20a37f] h-8 w-8 justify-center items-center">
                  <Image src="/gpt.svg" alt="gpt" width={20} height={20} />
                </div>
              )}
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
                    <AiOutlineUser className="text-white dark:text-neutral-600" />
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm text-neutral-500 dark:text-neutral-300/90 flex items-center gap-4">
                {format(Number(item.time), "MM-DD HH:mm:ss")}
                <div className="flex gap-1.5">
                  <CopyIcon
                    className="transition-colors hover:text-black/90 dark:hover:text-sky-400/90"
                    content={item.content}
                  />
                  <Confirm
                    title={t("delete-chat")}
                    content={t("delete-chat-tip")}
                    trigger={
                      <div>
                        <AiOutlineDelete
                          className="cursor-pointer transition-colors hover:text-black/90 dark:hover:text-sky-400/90"
                          size={19}
                        />
                      </div>
                    }
                    onOk={() => onDelete(item)}
                  />
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

                {item.role === "assistant" &&
                  (userInfo.license_type === "premium" ||
                    userInfo.license_type === "team") && (
                    <>
                      <Divider className="border-b-neutral-400/20 dark:border-b-neutral-200/20 my-2" />
                      <div className="flex gap-2 items-center">
                        <Button
                          type="outline"
                          size="xs"
                          leftIcon={<BsFillPlayFill size={18} />}
                          loading={item.tts_loading}
                          onClick={() =>
                            onRead(item, findChannel?.channel_id as string)
                          }
                        />
                        {item.tts_loading && (
                          <Button
                            size="xs"
                            type="primary"
                            onClick={() =>
                              onPause(item, findChannel?.channel_id as string)
                            }
                          >
                            <BsStopFill size={18} />
                          </Button>
                        )}
                        <Link
                          className="md:hidden group-hover/item:block text-sm"
                          onClick={onTTSSetting}
                        >
                          Setting
                        </Link>
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>
        ))}
        {!!findChannel?.channel_loading_connect && (
          <AiOutlineLoading
            size={24}
            className="animate-spin text-sky-400 ml-11 dark:text-sky-400/90"
          />
        )}
      </div>
      <div className="h-32 overflow-hidden" />
    </>
  );
};

export default ChatList;
