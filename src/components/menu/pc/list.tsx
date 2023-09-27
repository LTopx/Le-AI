import React from "react";
import { useSession } from "next-auth/react";
import { useTranslations, useFormatter } from "next-intl";
import { Confirm } from "@ltopx/lx-ui";
import { useChannelStore } from "@/hooks/useChannel";
import { cn } from "@/lib";
import { checkAuth } from "@/lib/checkEnv";
import Icon from "@/components/icon";
import MenuIcon from "../icon";

export default function List() {
  const session = useSession();
  const [activeId, channelList] = useChannelStore((state) => [
    state.activeId,
    state.list,
  ]);
  const deleteList = useChannelStore((state) => state.deleteList);
  const updateActiveId = useChannelStore((state) => state.updateActiveId);
  const formats = useFormatter();

  const tGlobal = useTranslations("global");
  const tChat = useTranslations("chat");

  const onChangeChannel = (id: string) => {
    if (id === activeId) return;
    updateActiveId(id);
  };

  const height = React.useMemo(() => {
    if (session.data) return "h-[calc(100vh-16rem)]";
    if (!checkAuth()) return "h-[calc(100vh-10rem)]";
    return "h-[calc(100vh-13rem)]";
  }, [session.data]);

  return (
    <div className={cn("overflow-y-auto scroll-smooth", height)}>
      {channelList.map((channel) => (
        <div
          key={channel.channel_id}
          className={cn(
            "rounded-lg cursor-pointer mb-1 overflow-hidden relative flex flex-col h-16 text-xs px-[0.5rem] transition-colors gap-1 group justify-center",
            "hover:bg-gray-200/60 dark:hover:bg-slate-700/70",
            {
              "bg-sky-100 hover:bg-sky-100 dark:bg-slate-600 dark:hover:bg-slate-600":
                channel.channel_id === activeId,
            }
          )}
          onClick={() => onChangeChannel(channel.channel_id)}
        >
          <div className="flex justify-between items-center text-black/90 dark:text-white/90">
            <div className="text-sm text-ellipsis max-w-[26ch] pl-5 transition-colors relative overflow-hidden whitespace-nowrap">
              <MenuIcon
                name={channel.channel_icon}
                loading={channel.channel_loading}
              />
              <span className="font-medium">
                {channel.channel_name || tChat("new-conversation")}
              </span>
            </div>
          </div>
          <div
            className={cn(
              "flex justify-between transition-all",
              "text-neutral-500/90 dark:text-neutral-500 dark:group-hover:text-neutral-400",
              { "dark:text-neutral-400": channel.channel_id === activeId }
            )}
          >
            {channel.chat_list.length} {tChat("messages")}
            <div className="tabular-nums group-hover:opacity-0">
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
                "opacity-0 top-[50%] -translate-y-[50%] transition-all -right-[2rem] absolute group-hover:opacity-100 group-hover:right-2",
                "text-neutral-500/90 hover:text-black/90",
                "dark:text-neutral-400 dark:hover:text-white/90"
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
