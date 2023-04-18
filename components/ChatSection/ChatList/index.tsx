import * as React from "react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useDateFormat } from "l-hooks";
import { CopyIcon, ChatContent } from "@/components";
import { AiOutlineLoading, AiOutlineDelete } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { useChannel, useRevoke } from "@/hooks";
import type { ChatItem } from "@/hooks";
import { useChatLoading } from "@/state";
import GPTSvg from "@/assets/gpt.svg";

const ChatList: React.FC = () => {
  const { t } = useTranslation("chat");
  const [channel, setChannel] = useChannel();
  const { format } = useDateFormat();
  const loadingStart = useChatLoading((state) => state.loadingResponseStart);

  const chatList =
    channel.list.find((item) => item.channel_id === channel.activeId)
      ?.chat_list || [];

  const { set } = useRevoke({
    revoke: (value) => onRevoke(value),
    tip: t("content-deleted") as string,
    btn: t("undo") as string,
  });

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

  return (
    <div>
      <div className="flex flex-col mt-5 gap-5 ">
        {chatList.map((item, index) => (
          <div
            key={item.id}
            className={classNames("flex gap-3 group", { "mt-12": index === 0 })}
          >
            <div>
              {item.role === "assistant" && (
                <div className="rounded-full flex bg-[#20a37f] h-8 w-8 justify-center items-center">
                  <GPTSvg />
                </div>
              )}
              {item.role === "user" && (
                <div className="rounded-full flex bg-[#000]/25 h-8 w-8 justify-center items-center">
                  <FaUserAlt className="text-white" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm text-[#a4a9b1]">
                {format(Number(item.time), "MM-DD HH:mm:ss")}
              </div>
              <div
                className={classNames(
                  "self-start py-2.5 px-3 rounded-md relative",
                  { "bg-[#d1e3ff]": item.role === "user" },
                  { "bg-[#ebeced]": item.role === "assistant" }
                )}
              >
                <ChatContent data={item} />
                <div
                  className={classNames(
                    "opacity-0 invisible bg-white border border-[#dee0e3] rounded-md flex gap-0.5 transition-all absolute group-hover:opacity-100 group-hover:visible",
                    "top-[-1.7rem] left-[6.5rem] group-hover:left-28",
                    "md:top-0 md:left-auto md:right-[-3.2rem] md:group-hover:right-[-3.7rem] md:group-hover:left-auto"
                  )}
                >
                  <CopyIcon
                    className="text-icon hover:text-icon-hover transition-colors h-6 w-6 flex justify-center items-center cursor-pointer"
                    content={item.content}
                  />
                  <div className="w-[1px] bg-[#dee0e3]" />
                  <div
                    onClick={() => onDelete(item)}
                    className="text-icon hover:text-icon-hover transition-colors h-6 w-6 flex justify-center items-center cursor-pointer"
                  >
                    <AiOutlineDelete size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {loadingStart && (
          <AiOutlineLoading
            size={24}
            className="animate-spin text-primary ml-11"
          />
        )}
      </div>
      <div className="h-32 overflow-hidden" />
    </div>
  );
};

export default ChatList;
