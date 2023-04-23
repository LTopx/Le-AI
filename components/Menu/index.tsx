import * as React from "react";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "next-i18next";
import { AiOutlineDelete, AiFillGithub } from "react-icons/ai";
import { BsChatSquareText } from "react-icons/bs";
import { useDateFormat } from "l-hooks";
import { v4 as uuidv4 } from "uuid";
import { useChannel, initChannelList } from "@/hooks";
import { Button, Confirm } from "@/components";

const Menu: React.FC = () => {
  const { t } = useTranslation("menu");
  const { format } = useDateFormat();

  const [channel, setChannel] = useChannel();

  const stopPropagation = (e: any) => e.stopPropagation();

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

  const onDeleteChannel = (id: string) => {
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
    setChannel((channel) => {
      channel.list = initChannelList;
      channel.activeId = initChannelList[0].channel_id;
      return channel;
    });
  };

  return (
    <div
      className={classNames(
        "p-2 hidden md:block md:w-[17.5rem] transition-colors select-none",
        "bg-white",
        "dark:bg-slate-800"
      )}
    >
      <Button
        className="mb-2"
        type="primary"
        size="lg"
        block
        onClick={onAddChannel}
      >
        {t("new-chat")}
      </Button>
      <div className="h-pcMenu overflow-y-auto">
        {channel.list.map((item) => (
          <div
            key={item.channel_id}
            onClick={() => onChangeChannel(item.channel_id)}
            className={twMerge(
              classNames(
                "rounded-lg cursor-pointer mb-1 overflow-hidden relative flex flex-col h-16 text-xs px-[0.5rem] transition-colors gap-1 group justify-center",
                "hover:bg-gray-200/60 dark:hover:bg-slate-700/70",
                {
                  "bg-menu-active hover:bg-menu-active dark:bg-slate-600 dark:hover:bg-slate-600":
                    item.channel_id === channel.activeId,
                }
              )
            )}
          >
            <div
              className={classNames(
                "flex justify-between items-center",
                "text-black/90",
                "dark:text-white/90"
              )}
            >
              <div className="text-sm text-ellipsis max-w-[26ch] pl-5 relative overflow-hidden whitespace-nowrap transition-colors">
                <BsChatSquareText className="top-[50%] left-0 translate-y-[-50%] absolute" />
                <span className="font-medium">
                  {item.channel_name || t("new-conversation")}
                </span>
              </div>
            </div>
            <div
              className={twMerge(
                classNames(
                  "flex justify-between transition-all",
                  "text-neutral-500/90 dark:text-neutral-500 dark:group-hover:text-neutral-400",
                  {
                    "dark:text-neutral-400":
                      item.channel_id === channel.activeId,
                  }
                )
              )}
            >
              {item.chat_list.length} {t("messages")}
              <div className="group-hover:opacity-0 tabular-nums">
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
            <Confirm
              title={t("delete-this-conversation")}
              content={t("delete-conversation")}
              trigger={
                <div
                  onClick={stopPropagation}
                  className={classNames(
                    "opacity-0 transition-all right-[-2rem] absolute group-hover:opacity-100 group-hover:right-2",
                    "text-neutral-500/90 hover:text-black/90",
                    "dark:text-neutral-400 dark:hover:text-white/90"
                  )}
                >
                  <AiOutlineDelete size={20} />
                </div>
              }
              onOk={() => onDeleteChannel(item.channel_id)}
            />
          </div>
        ))}
      </div>
      <div className="h-[6.5rem] flex flex-col gap-2 border-t dark:border-white/20 pt-2">
        <Confirm
          title={t("clear-all-conversation")}
          content={t("clear-conversation")}
          trigger={
            <div
              className={classNames(
                "hover:bg-gray-200/60 h-11 rounded-lg transition-colors text-sm cursor-pointer flex items-center gap-2 px-2",
                "dark:hover:bg-slate-700/70"
              )}
            >
              <AiOutlineDelete size={16} /> {t("clear-all-conversation")}
            </div>
          }
          onOk={onClearChannel}
        />
        <a
          href="https://github.com/Peek-A-Booo/L-GPT"
          target="_blank"
          className={classNames(
            "hover:bg-gray-200/60 h-11 rounded-lg transition-colors text-sm cursor-pointer flex items-center gap-2 px-2",
            "dark:hover:bg-slate-700/70"
          )}
        >
          <AiFillGithub size={16} /> Github
        </a>
      </div>
    </div>
  );
};

export default Menu;
