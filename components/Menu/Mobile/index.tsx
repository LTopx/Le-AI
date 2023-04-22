import * as React from "react";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "next-i18next";
import { useDateFormat } from "l-hooks";
import { AiOutlineDelete, AiFillGithub } from "react-icons/ai";
import { BsChatSquareText } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import { Drawer, Confirm, NewButton } from "@/components";
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
      overlayClassName="md:hidden"
      title={t("coversation-list")}
      width="78%"
      open={open}
      onClose={onClose}
    >
      <div className="p-2">
        <NewButton
          className="mb-2"
          type="primary"
          size="lg"
          block
          onClick={onAddChannel}
        >
          {t("new-chat")}
        </NewButton>
        <div className="h-mobileMenu overflow-y-auto select-none">
          {channel.list.map((item) => (
            <div
              key={item.channel_id}
              onClick={() => onChangeChannel(item.channel_id)}
              className={twMerge(
                classNames(
                  "rounded-lg mb-1 cursor-pointer transition-colors overflow-hidden relative flex flex-col h-16 text-xs px-[0.5rem] gap-1 justify-center",
                  "hover:bg-gray-200/60 dark:hover:bg-slate-700/70",
                  {
                    "bg-menu-active hover:bg-menu-active dark:bg-slate-600 dark:hover:bg-slate-600":
                      item.channel_id === channel.activeId,
                  }
                )
              )}
            >
              <div className="flex justify-between items-center gap-2">
                <div
                  className={classNames(
                    "font-medium text-sm text-ellipsis pl-5 overflow-hidden whitespace-nowrap relative",
                    "text-black/90",
                    "dark:text-white/90"
                  )}
                >
                  <BsChatSquareText className="top-[50%] left-0 translate-y-[-50%] absolute" />
                  {item.channel_name || t("new-conversation")}
                </div>
                <div
                  className={classNames(
                    "text-neutral-500/90 dark:text-neutral-500 dark:group-hover:text-neutral-400 tabular-nums flex-none text-right",
                    {
                      "dark:text-neutral-400/80":
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
                className={classNames(
                  "text-neutral-500/90 dark:text-neutral-500 dark:group-hover:text-neutral-400",
                  {
                    "dark:text-neutral-400/80":
                      item.channel_id === channel.activeId,
                  }
                )}
              >
                {item.chat_list.length} {t("messages")}
              </div>
              <Confirm
                title={t("delete-this-conversation")}
                content={t("delete-conversation")}
                trigger={
                  <div
                    className={classNames(
                      "right-2 bottom-1 absolute",
                      "text-black/90",
                      "dark:text-white/90"
                    )}
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
              <div
                className={classNames(
                  "h-11 rounded-md text-sm cursor-pointer flex items-center gap-2 px-2 transition-colors",
                  "hover:bg-gray-200/60 text-black/90",
                  "dark:hover:bg-slate-700/70 dark:text-white/90"
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
              "h-11 rounded-md text-sm flex items-center gap-2 px-2 transition-colors",
              "hover:bg-gray-200/60 text-black/90",
              "dark:hover:bg-slate-700/70 dark:text-white/90"
            )}
          >
            <AiFillGithub size={16} /> Github
          </a>
        </div>
      </div>
    </Drawer>
  );
};

export default MobileMenu;
