import * as React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "next-i18next";
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
import { useChannel, initChannelList } from "@/hooks";
import type { ChannelListItem } from "@/hooks";
import { Button, Confirm, ContextMenu } from "@/components";
import type { ContextMenuOption } from "@/components";
import { useSettingOpen } from "@/state";
import { AI_MODELS } from "@/utils/models";
import renderIcon from "./renderIcon";

const Menu: React.FC = () => {
  const { t } = useTranslation("menu");
  const { theme, setTheme } = useTheme();
  const { format } = useDateFormat();
  const setOpen = useSettingOpen((state) => state.update);
  const [nowTheme, setNowTheme] = React.useState<any>("");

  const [channel, setChannel] = useChannel();
  const menuOptions: ContextMenuOption[] = [
    {
      label: "置顶",
      value: "top",
      icon: <AiOutlineVerticalAlignTop size={18} />,
    },
    {
      label: "删除",
      value: "delete",
      icon: <AiOutlineDelete size={18} />,
    },
  ];

  const stopPropagation = (e: any) => e.stopPropagation();

  const onAddChannel = () => {
    const channel_id = uuidv4();
    setChannel((channel) => {
      channel.list.push({
        channel_id,
        channel_icon: "RiChatSmile2Line",
        channel_name: "",
        channel_model: {
          type: AI_MODELS[0].value,
          name: AI_MODELS[0].models[0].value,
        },
        channel_prompt: "",
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

  const onSelectMenu = (params: ContextMenuOption, val: ChannelListItem) => {
    if (params.value === "top") {
      setChannel((channel) => {
        const findIndex = channel.list.findIndex(
          (item) => item.channel_id === val.channel_id
        );
        if (findIndex === -1) return channel;
        const splice = channel.list.splice(findIndex, 1);
        channel.list.unshift(splice[0]);
        return channel;
      });
    } else if (params.value === "delete") {
      onDeleteChannel(val.channel_id);
    }
  };

  const onToggleTheme = () => setTheme(nowTheme === "light" ? "dark" : "light");

  const onOpenPrompt = () => alert("Prompt Manage ToDo...");

  const onOpenSetting = () => setOpen(true);

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
      <div className="h-12 pb-2 flex items-center font-extrabold text-2xl text-transparent">
        <span className="bg-clip-text bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
          L - GPT
        </span>
      </div>
      <Button
        className="mb-2"
        type="primary"
        size="lg"
        block
        onClick={onAddChannel}
      >
        {t("new-chat")}
      </Button>
      <div className="h-[calc(100vh-13.75rem)] overflow-y-auto">
        {channel.list.map((item) => (
          <ContextMenu
            key={item.channel_id}
            options={menuOptions}
            onSelect={(params) => onSelectMenu(params, item)}
          >
            <div
              onClick={() => onChangeChannel(item.channel_id)}
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
                <div className="text-sm text-ellipsis max-w-[26ch] pl-5 relative overflow-hidden whitespace-nowrap transition-colors">
                  {renderIcon(item.channel_icon)}
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
                    className={clsx(
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
          </ContextMenu>
        ))}
      </div>
      <div className="h-[6.25rem] flex flex-col gap-1 border-t dark:border-white/20 pt-2">
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
          onOk={onClearChannel}
        />
        <div className="h-11 items-center justify-center flex">
          <div className="flex-1 flex justify-center">
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
          <div className="flex-1 flex justify-center">
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
          <div className="flex-1 flex justify-center">
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
          <div className="flex-1 flex justify-center">
            <div
              onClick={onOpenSetting}
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
