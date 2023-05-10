import * as React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  AiOutlineDelete,
  AiFillGithub,
  AiOutlineVerticalAlignTop,
  AiOutlineSetting,
} from "react-icons/ai";
import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";
import { HiLightBulb } from "react-icons/hi";
import { useDateFormat } from "l-hooks";
import { v4 as uuidv4 } from "uuid";
import { useSetting, useChannel, initChannelList } from "@/hooks";
import type { ChannelListItem } from "@/hooks";
import { Button, Confirm, ContextMenu } from "@/components";
import type { ContextMenuOption } from "@/components";
import { LLM } from "@/utils/constant";
import MenuIcon from "./icon";

const Menu: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("menu");
  const { format } = useDateFormat();
  const [, setVisible] = useSetting();
  const [channel, setChannel] = useChannel();

  const [nowTheme, setNowTheme] = React.useState<"dark" | "light">("light");

  const menuItems: ContextMenuOption[] = [
    {
      label: t("to-top"),
      value: "top",
      icon: <AiOutlineVerticalAlignTop size={18} />,
    },
    {
      label: t("delete"),
      value: "delete",
      icon: <AiOutlineDelete size={18} />,
    },
  ];

  const onChannelAdd = () => {
    const channel_id = uuidv4();
    setChannel((channel) => {
      channel.list.push({
        channel_id,
        channel_icon: "RiChatSmile2Line",
        channel_name: "",
        channel_model: {
          type: LLM[0].value,
          name: LLM[0].models[0].value,
        },
        channel_prompt: "",
        chat_list: [],
      });
      channel.activeId = channel_id;
      return channel;
    });
  };

  const onChannelClear = () => {
    setChannel((channel) => {
      channel.list = initChannelList;
      channel.activeId = initChannelList[0].channel_id;
      return channel;
    });
  };

  const onChannelDelete = (id: string) => {
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

  const onChannelChange = (id: string) => {
    if (id === channel.activeId) return;
    setChannel((channel) => {
      channel.activeId = id;
      return channel;
    });
  };

  const onSelectMenu = ({ value }: ContextMenuOption, v: ChannelListItem) => {
    if (value === "top") {
      setChannel((channel) => {
        const { list } = channel;
        const findIndex = list.findIndex((e) => e.channel_id === v.channel_id);
        if (findIndex === -1) return channel;
        [list[0], list[findIndex]] = [list[findIndex], list[0]];
        return channel;
      });
    } else if (value === "delete") {
      onChannelDelete(v.channel_id);
    }
  };

  const onToggleTheme = () => setTheme(nowTheme === "light" ? "dark" : "light");

  const onOpenPrompt = () => alert("Prompt Manage ToDo...");

  React.useEffect(() => {
    setNowTheme(theme === "dark" ? "dark" : "light");
  }, [theme]);

  return (
    <div
      className={clsx(
        "p-2 hidden md:block md:w-[17.5rem] transition-colors select-none",
        "bg-white",
        "dark:bg-slate-800"
      )}
    >
      <div className="flex font-extrabold h-12 text-transparent pb-2 text-2xl items-center">
        <span className="bg-clip-text bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
          L - GPT
        </span>
      </div>
      <Button
        className="mb-2"
        type="primary"
        size="lg"
        block
        onClick={onChannelAdd}
      >
        {t("new-chat")}
      </Button>
      <div className="h-[calc(100vh-13.75rem)] overflow-y-auto">
        {channel.list.map((item) => (
          <ContextMenu
            key={item.channel_id}
            options={menuItems}
            onSelect={(params) => onSelectMenu(params, item)}
          >
            <div
              onClick={() => onChannelChange(item.channel_id)}
              className={twMerge(
                clsx(
                  "rounded-lg cursor-pointer mb-1 overflow-hidden relative flex flex-col h-16 text-xs px-[0.5rem] transition-colors gap-1 group justify-center",
                  "hover:bg-gray-200/60 dark:hover:bg-slate-700/70",
                  {
                    "bg-sky-100 hover:bg-sky-100 dark:bg-slate-600 dark:hover:bg-slate-600":
                      item.channel_id === channel.activeId,
                  }
                )
              )}
            >
              <div
                className={clsx(
                  "flex justify-between items-center",
                  "text-black/90",
                  "dark:text-white/90"
                )}
              >
                <div className="text-sm text-ellipsis max-w-[26ch] pl-5 transition-colors relative overflow-hidden whitespace-nowrap">
                  <MenuIcon name={item.channel_icon} />
                  <span className="font-medium">
                    {item.channel_name || t("new-conversation")}
                  </span>
                </div>
              </div>
              <div
                className={twMerge(
                  clsx(
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
                <div className="tabular-nums group-hover:opacity-0">
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
                    onClick={(e) => e.stopPropagation()}
                    className={clsx(
                      "opacity-0 transition-all right-[-2rem] absolute group-hover:opacity-100 group-hover:right-2",
                      "text-neutral-500/90 hover:text-black/90",
                      "dark:text-neutral-400 dark:hover:text-white/90"
                    )}
                  >
                    <AiOutlineDelete size={20} />
                  </div>
                }
                onOk={() => onChannelDelete(item.channel_id)}
              />
            </div>
          </ContextMenu>
        ))}
      </div>
      <div className="border-t flex flex-col h-[6.25rem] pt-2 gap-1 dark:border-white/20">
        <Confirm
          title={t("clear-all-conversation")}
          content={t("clear-conversation")}
          trigger={
            <div
              className={clsx(
                "hover:bg-gray-200/60 h-11 rounded-lg transition-colors text-sm cursor-pointer flex items-center gap-2 px-2",
                "dark:hover:bg-slate-700/70"
              )}
            >
              <AiOutlineDelete size={16} /> {t("clear-all-conversation")}
            </div>
          }
          onOk={onChannelClear}
        />
        <div className="flex h-11 items-center justify-center">
          <div className="flex flex-1 justify-center">
            <div
              onClick={onToggleTheme}
              className={clsx(
                "w-8 h-8 flex justify-center items-center cursor-pointer transition-colors rounded-md",
                "hover:bg-gray-200/60",
                "dark:hover:bg-slate-700/70"
              )}
            >
              {nowTheme === "light" ? (
                <MdDarkMode size={20} />
              ) : (
                <MdOutlineLightMode size={20} />
              )}
            </div>
          </div>
          <div className="flex flex-1 justify-center">
            <a
              href="https://github.com/Peek-A-Booo/L-GPT"
              target="_blank"
              className={clsx(
                "w-8 h-8 flex justify-center items-center cursor-pointer transition-colors rounded-md",
                "hover:bg-gray-200/60",
                "dark:hover:bg-slate-700/70"
              )}
            >
              <AiFillGithub size={20} />
            </a>
          </div>
          <div className="flex flex-1 justify-center">
            <div
              onClick={onOpenPrompt}
              className={clsx(
                "w-8 h-8 flex justify-center items-center cursor-pointer transition-colors rounded-md",
                "hover:bg-gray-200/60",
                "dark:hover:bg-slate-700/70"
              )}
            >
              <HiLightBulb size={20} />
            </div>
          </div>
          <div className="flex flex-1 justify-center">
            <div
              onClick={() => setVisible(true)}
              className={clsx(
                "w-8 h-8 flex justify-center items-center cursor-pointer transition-colors rounded-md",
                "hover:bg-gray-200/60",
                "dark:hover:bg-slate-700/70"
              )}
            >
              <AiOutlineSetting size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
