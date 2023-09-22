import React from "react";
import { useTranslations, useFormatter } from "next-intl";
import { Confirm } from "@ltopx/lx-ui";
import { useChannelStore } from "@/hooks/useChannel";
import { cn } from "@/lib";
import Icon from "@/components/icon";
import MenuIcon from "../icon";

interface ListProps {
  onClose: () => void;
}

export default function List({ onClose }: ListProps) {
  const tGlobal = useTranslations("global");
  const tChat = useTranslations("chat");

  const [activeId, channelList] = useChannelStore((state) => [
    state.activeId,
    state.list,
  ]);

  const formats = useFormatter();

  const deleteList = useChannelStore((state) => state.deleteList);
  const updateActiveId = useChannelStore((state) => state.updateActiveId);

  const onChangeChannel = (id: string) => {
    if (id === activeId) return;
    updateActiveId(id);
    onClose();
  };

  return (
    <div className="flex-1 overflow-y-auto select-none">
      {channelList.map((channel) => (
        <div
          key={channel.channel_id}
          className={cn(
            "rounded-lg mb-1 cursor-pointer transition-colors overflow-hidden relative flex flex-col h-16 text-xs px-[0.5rem] gap-1 justify-center",
            "hover:bg-gray-200/60 dark:hover:bg-slate-700/70",
            {
              "bg-sky-100 hover:bg-sky-100 dark:bg-slate-600 dark:hover:bg-slate-600":
                channel.channel_id === activeId,
            }
          )}
          onClick={() => onChangeChannel(channel.channel_id)}
        >
          <div className="flex gap-2 justify-between items-center">
            <div
              className={cn(
                "font-medium text-sm text-ellipsis pl-5 overflow-hidden whitespace-nowrap relative",
                "text-black/90",
                "dark:text-white/90"
              )}
            >
              <MenuIcon name={channel.channel_icon} />
              {channel.channel_name || tChat("new-conversation")}
            </div>
            <div
              className={cn(
                "text-neutral-500/90 dark:text-neutral-500 dark:group-hover:text-neutral-400 tabular-nums flex-none text-right",
                {
                  "dark:text-neutral-400/80": channel.channel_id === activeId,
                }
              )}
            >
              {!!(channel.chat_list.length && channel.chat_list.at(-1)?.time) &&
                formats.dateTime(
                  new Date(Number(channel.chat_list.at(-1)?.time)),
                  {
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  }
                )}
            </div>
          </div>
          <div
            className={cn(
              "text-neutral-500/90 dark:text-neutral-500 dark:group-hover:text-neutral-400",
              {
                "dark:text-neutral-400": channel.channel_id === activeId,
              }
            )}
          >
            {channel.chat_list.length} {tChat("messages")}
          </div>
          <Confirm
            title={tChat("delete-chat")}
            content={tChat("delete-chat-tip")}
            type="danger"
            okText={tGlobal("ok-spacing")}
            cancelText={tGlobal("cancel-spacing")}
            onOk={() => deleteList(channel.channel_id)}
          >
            <div
              className={cn(
                "right-2 bottom-1 absolute",
                "text-black/70",
                "dark:text-white/90"
              )}
            >
              <Icon icon="delete_2_line" size={20} />
            </div>
          </Confirm>
        </div>
      ))}
    </div>
  );
}
