import * as React from "react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { AiOutlineDelete, AiFillGithub } from "react-icons/ai";
import { BsChatSquareText } from "react-icons/bs";
import { useDateFormat } from "l-hooks";
import { v4 as uuidv4 } from "uuid";
import { useChannel, initChannelList } from "@/hooks";

const Menu: React.FC = () => {
  const { t } = useTranslation("menu");
  const { format } = useDateFormat();

  const [channel, setChannel] = useChannel();

  const onAddChannel = () => {
    const channel_id = uuidv4();
    setChannel((channel) => {
      channel.list.push({
        channel_id,
        channel_name: "",
        chat_list: [],
      });
      channel.activeId = channel_id;
      return channel;
    });
  };

  const onChangeChannel = (id: string) => {
    if (id === channel.activeId) return;
    setChannel((channel) => {
      channel.activeId = id;
      return channel;
    });
  };

  const onDeleteChannel = (e: any, id: string) => {
    e.stopPropagation();
    const confirmMsg = t("delete-conversation");
    if (!confirm(confirmMsg)) return;

    if (channel.list.length <= 1) {
      setChannel((channel) => {
        channel.list = initChannelList;
        channel.activeId = initChannelList[0].channel_id;
        return channel;
      });
    } else {
      setChannel((channel) => {
        channel.list = channel.list.filter((item) => item.channel_id !== id);
        if (id === channel.activeId) {
          channel.activeId = channel.list[0].channel_id;
        }
        return channel;
      });
    }
  };

  const onClearChannel = () => {
    const confirmMsg = t("clear-conversation");
    if (!confirm(confirmMsg)) return;

    setChannel((channel) => {
      channel.list = initChannelList;
      channel.activeId = initChannelList[0].channel_id;
      return channel;
    });
  };

  return (
    <div className="p-2 select-none hidden md:block md:w-[17.5rem]">
      <div
        onClick={onAddChannel}
        className="rounded-lg cursor-pointer flex bg-[#678fff] h-12 text-white mb-2 transition-colors justify-center items-center hover:bg-[#678fff]/80"
      >
        {t("new-chat")}
      </div>
      <div className="h-pcMenu overflow-y-auto">
        {channel.list.map((item) => (
          <div
            key={item.channel_id}
            onClick={() => onChangeChannel(item.channel_id)}
            className={classNames(
              "rounded-lg cursor-pointer mb-1 overflow-hidden relative flex flex-col h-16 text-xs text-base-color px-[0.5rem] transition-colors gap-1 group justify-center hover:bg-menu-hover",
              { "!bg-menu-active": item.channel_id === channel.activeId }
            )}
          >
            <div className="flex justify-between items-center">
              <div className="font-medium text-sm text-ellipsis max-w-[26ch] pl-5 relative overflow-hidden whitespace-nowrap">
                <BsChatSquareText className="top-[50%] left-0 translate-y-[-50%] absolute" />
                {item.channel_name || t("new-conversation")}
              </div>
            </div>
            <div className="flex text-[#858b96] justify-between group-hover:text-[#6e737b]">
              <div>
                {item.chat_list.length} {t("messages")}
              </div>
              <div className="transition-opacity text-[#858b96] group-hover:opacity-0">
                {item.chat_list.length
                  ? item.chat_list.at(-1)?.time
                    ? format(
                        Number(item.chat_list.at(-1)?.time),
                        "MM-DD HH:mm:ss"
                      )
                    : ""
                  : ""}
              </div>
            </div>
            <AiOutlineDelete
              onClick={(e) => onDeleteChannel(e, item.channel_id)}
              size={20}
              className="opacity-0 transition-all right-[-2rem] absolute group-hover:opacity-100 group-hover:right-2"
            />
          </div>
        ))}
      </div>
      <div className="h-[6.5rem] flex flex-col gap-2 border-t pt-2">
        <div
          onClick={onClearChannel}
          className="h-11 rounded-md transition-colors text-sm hover:bg-menu-hover cursor-pointer flex items-center gap-2 px-2"
        >
          <AiOutlineDelete size={16} /> {t("clear-all-conversation")}
        </div>
        <a
          href="https://github.com/Peek-A-Booo/L-GPT"
          target="_blank"
          className="h-11 rounded-md transition-colors text-sm hover:bg-menu-hover cursor-pointer flex items-center gap-2 px-2"
        >
          <AiFillGithub size={16} /> Github
        </a>
      </div>
    </div>
  );
};

export default Menu;
