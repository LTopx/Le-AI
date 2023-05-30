import * as React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useDateFormat } from "l-hooks";
import CopyIcon from "@/components/copyIcon";
import ChatContent from "@/components/chatContent";
import { useScrollToBottom } from "@/components/scrollToBottoms";
import {
  AiOutlineLoading,
  AiOutlineDelete,
  AiOutlineUser,
} from "react-icons/ai";
import { cn } from "@/lib";
import { useChannel, useRevoke, useChat } from "@/hooks";
import type { ChatItem } from "@/hooks";
import Configure from "./configure";

const ChatList: React.FC = () => {
  const session = useSession();
  const t = useTranslations("chat");
  const { format } = useDateFormat();

  const user = session.data?.user;

  const [channel, setChannel] = useChannel();
  const { loadingResponseStart } = useChat();

  const findChannel = channel.list.find(
    (item) => item.channel_id === channel.activeId
  );

  const chatList = findChannel?.chat_list || [];

  const { set } = useRevoke({
    revoke: (value) => onRevoke(value),
    tip: t("content-deleted") as string,
    btn: t("undo") as string,
  });

  const scrollToBottom = useScrollToBottom();

  const onDelete = (item: ChatItem) => {
    const { id } = item;
    setChannel((channel) => {
      const { list, activeId } = channel;
      const findChannel = list.find((item) => item.channel_id === activeId);
      if (!findChannel) return channel;
      const findChatIndex = findChannel.chat_list.findIndex(
        (item) => item.id === id
      );
      set("chatItem", {
        id: activeId,
        index: findChatIndex,
        content: findChannel.chat_list[findChatIndex],
      });
      findChannel.chat_list = findChannel.chat_list.filter(
        (item) => item.id !== id
      );
      return channel;
    });
  };

  const onRevoke = (value: any[]) => {
    const { id, index, content } = value[0].value;
    setChannel((channel) => {
      const { list } = channel;
      const findChannel = list.find((item) => item.channel_id === id);
      if (!findChannel) return channel;
      findChannel.chat_list.splice(index, 0, content);
      return channel;
    });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [channel.activeId]);

  return (
    <>
      {!chatList.length && !findChannel?.channel_prompt && <Configure />}
      <div className="flex flex-col mt-5 gap-5 ">
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
                  <AiOutlineDelete
                    className="cursor-pointer transition-colors hover:text-black/90 dark:hover:text-sky-400/90"
                    onClick={() => onDelete(item)}
                    size={19}
                  />
                </div>
              </div>
              <div
                className={cn(
                  "self-start py-2.5 px-3 rounded-md relative border border-transparent",
                  { "bg-blue-200/70 dark:bg-blue-900": item.role === "user" },
                  {
                    "bg-neutral-200/60 dark:bg-neutral-800/90 dark:border-neutral-600/60":
                      item.role === "assistant",
                  }
                )}
              >
                <ChatContent data={item} />
              </div>
            </div>
          </div>
        ))}
        {loadingResponseStart && (
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
