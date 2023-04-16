import React from "react";
import classNames from "classnames";
import { useDateFormat } from "l-hooks";
import { CopyIcon, ChatContent } from "@/components";
import { AiOutlineLoading } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { useChannel } from "@/hooks";
import { useChatLoading } from "@/state";
import GPTSvg from "@/assets/gpt.svg";

const ChatList: React.FC = () => {
  const [channel] = useChannel();
  const { format } = useDateFormat();
  const loadingStart = useChatLoading((state) => state.loadingResponseStart);

  const chatList =
    channel.list.find((item) => item.channel_id === channel.activeId)
      ?.chat_list || [];

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
                <CopyIcon
                  className={classNames(
                    "cursor-pointer flex h-6 opacity-0 invisible transition-all text-gray-500 w-6 justify-center items-center absolute group-hover:opacity-100 group-hover:visible",
                    "top-[-1.6rem] left-[6.5rem] group-hover:left-28",
                    "md:top-0 md:left-auto md:right-[-1.5rem] md:group-hover:right-[-2rem] md:group-hover:left-auto"
                  )}
                  content={item.content}
                />
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
