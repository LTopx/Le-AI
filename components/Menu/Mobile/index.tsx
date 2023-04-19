import * as React from "react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useDateFormat } from "l-hooks";
import { AiOutlineDelete, AiFillGithub } from "react-icons/ai";
import { BsChatSquareText } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import { Drawer, Confirm } from "@/components";
import { useChannel, initChannelList } from "@/hooks";
import { useMobileMenuOpen } from "@/state";

const MobileMenu: React.FC = () => {
  const { t } = useTranslation("menu");
  const [channel, setChannel] = useChannel();
  const open = useMobileMenuOpen((state) => state.open);
  const setOpen = useMobileMenuOpen((state) => state.update);

  const { format } = useDateFormat();

  const onClose = () => setOpen(false);

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
    onClose();
  };

  const onChangeChannel = (id: string) => {
    if (id === channel.activeId) return onClose();
    setChannel((channel) => {
      channel.activeId = id;
      return channel;
    });
    onClose();
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
    <Drawer
      className="md:hidden"
      title={t("coversation-list")}
      width="85%"
      open={open}
      onClose={onClose}
    >
      <div className="p-2">
        <div
          onClick={onAddChannel}
          className={classNames(
            "rounded-lg cursor-pointer flex h-12 text-white mb-2 transition-all justify-center items-center",
            "bg-gradient-to-r from-cyan-500 to-blue-500 bg-magic-size hover:bg-magic-position"
          )}
        >
          {t("new-chat")}
        </div>
        <div className="h-mobileMenu overflow-y-auto">
          {channel.list.map((item) => (
            <div
              key={item.channel_id}
              onClick={() => onChangeChannel(item.channel_id)}
              className={classNames(
                "rounded-lg mt-1 overflow-hidden relative flex flex-col h-16 text-xs text-base-color px-[0.5rem] gap-1 justify-center",
                {
                  "!bg-menu-active dark:!bg-slate-700":
                    item.channel_id === channel.activeId,
                }
              )}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium text-sm text-ellipsis max-w-[22ch] pl-5 overflow-hidden whitespace-nowrap relative dark:text-white">
                  <BsChatSquareText className="top-[50%] left-0 translate-y-[-50%] absolute" />
                  {item.channel_name || t("new-conversation")}
                </div>
                <div
                  className={classNames(
                    "text-[#858b96] dark:text-neutral-500",
                    {
                      "dark:text-neutral-400":
                        item.channel_id === channel.activeId,
                    }
                  )}
                >
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
              <div
                className={classNames("text-[#858b96] dark:text-neutral-500", {
                  "dark:text-neutral-400": item.channel_id === channel.activeId,
                })}
              >
                {item.chat_list.length} {t("messages")}
              </div>
              <Confirm
                title={t("delete-this-conversation")}
                content={t("delete-conversation")}
                trigger={
                  <div
                    className="right-2 bottom-1 absolute dark:text-white"
                    onClick={stopPropagation}
                  >
                    <AiOutlineDelete size={20} />
                  </div>
                }
                onOk={() => onDeleteChannel(item.channel_id)}
              />
            </div>
          ))}
        </div>
        <div className="h-[6rem] flex flex-col border-t gap-1 pt-1">
          <Confirm
            title={t("clear-all-conversation")}
            content={t("clear-conversation")}
            trigger={
              <div className="h-11 rounded-md text-sm flex items-center gap-2 px-2 transition-colors hover:bg-menu-hover">
                <AiOutlineDelete size={16} /> {t("clear-all-conversation")}
              </div>
            }
            onOk={onClearChannel}
          />

          <a
            href="https://github.com/Peek-A-Booo/L-GPT"
            target="_blank"
            className="h-11 rounded-md text-sm flex items-center gap-2 px-2 transition-colors hover:bg-menu-hover"
          >
            <AiFillGithub size={16} /> Github
          </a>
        </div>
      </div>
    </Drawer>
  );
};

export default MobileMenu;
