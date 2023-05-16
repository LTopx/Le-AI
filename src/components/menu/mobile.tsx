import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useDateFormat } from "l-hooks";
import {
  AiOutlineDelete,
  AiFillGithub,
  AiOutlineSetting,
} from "react-icons/ai";
import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";
import { HiLightBulb, HiOutlineTranslate } from "react-icons/hi";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib";
import Drawer from "@/components/ui/Drawer";
import Confirm from "@/components/ui/Confirm";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import {
  useChannel,
  initChannelList,
  useMobileMenu,
  useSetting,
} from "@/hooks";
import { LLM } from "@/utils/constant";
import MenuIcon from "./icon";
import { lans } from "./index";

const MobileMenu: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("menu");
  const { format } = useDateFormat();
  const [channel, setChannel] = useChannel();
  const [mobileMenuVisible, setMobileMenuVisible] = useMobileMenu();
  const [, setSettingVisible] = useSetting();

  const [nowTheme, setNowTheme] = React.useState<any>("");

  const params = useParams();
  const router = useRouter();

  const locale = params?.locale || "en";

  const onClose = () => setMobileMenuVisible(false);

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
    onClose();
  };

  const onChannelChange = (id: string) => {
    if (id === channel.activeId) return onClose();
    setChannel((channel) => {
      channel.activeId = id;
      return channel;
    });
    onClose();
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

  const onToggleTheme = () => setTheme(nowTheme === "light" ? "dark" : "light");

  const onOpenPrompt = () => alert("Prompt Manage ToDo...");

  const onLocaleChange = (value: string) => {
    if (value === locale) return;
    onClose();
    router.push(value);
    document.body.style.pointerEvents = "";
  };

  React.useEffect(() => {
    setNowTheme(theme === "dark" ? "dark" : "light");
  }, [theme]);

  return (
    <Drawer
      className="md:hidden"
      overlayClassName="md:hidden"
      title={
        <div className="font-extrabold text-transparent text-xl">
          <span className="bg-clip-text bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
            L - GPT
          </span>
        </div>
      }
      width="78%"
      open={mobileMenuVisible}
      onClose={onClose}
    >
      <div className="p-2 h-[calc(100%-3.5rem)] flex flex-col">
        <Button
          className="mb-2"
          type="primary"
          size="lg"
          block
          onClick={onChannelAdd}
        >
          {t("new-chat")}
        </Button>
        <div className="flex-1 overflow-y-auto select-none">
          {channel.list.map((item) => (
            <div
              key={item.channel_id}
              onClick={() => onChannelChange(item.channel_id)}
              className={cn(
                "rounded-lg mb-1 cursor-pointer transition-colors overflow-hidden relative flex flex-col h-16 text-xs px-[0.5rem] gap-1 justify-center",
                "hover:bg-gray-200/60 dark:hover:bg-slate-700/70",
                {
                  "bg-sky-100 hover:bg-sky-100 dark:bg-slate-600 dark:hover:bg-slate-600":
                    item.channel_id === channel.activeId,
                }
              )}
            >
              <div className="flex justify-between items-center gap-2">
                <div
                  className={cn(
                    "font-medium text-sm text-ellipsis pl-5 overflow-hidden whitespace-nowrap relative",
                    "text-black/90",
                    "dark:text-white/90"
                  )}
                >
                  <MenuIcon name={item.channel_icon} />
                  {item.channel_name || t("new-conversation")}
                </div>
                <div
                  className={cn(
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
                className={cn(
                  "text-neutral-500/90 dark:text-neutral-500 dark:group-hover:text-neutral-400",
                  {
                    "dark:text-neutral-400":
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
                    className={cn(
                      "right-2 bottom-1 absolute",
                      "text-black/90",
                      "dark:text-white/90"
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AiOutlineDelete size={20} />
                  </div>
                }
                onOk={() => onChannelDelete(item.channel_id)}
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
                className={cn(
                  "h-11 rounded-md text-sm cursor-pointer flex items-center gap-2 px-2 transition-colors",
                  "hover:bg-gray-200/60 text-black/90",
                  "dark:hover:bg-slate-700/70 dark:text-white/90"
                )}
              >
                <AiOutlineDelete size={16} /> {t("clear-all-conversation")}
              </div>
            }
            onOk={onChannelClear}
          />
          <div className="h-11 items-center justify-center flex">
            <div className="flex-1 flex justify-center">
              <div
                onClick={onToggleTheme}
                className={cn(
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
                className={cn(
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
                className={cn(
                  "w-8 h-8 flex justify-center items-center cursor-pointer transition-colors rounded-md",
                  "hover:bg-gray-200/60",
                  "dark:hover:bg-slate-700/70"
                )}
              >
                <HiLightBulb size={20} />
              </div>
            </div>
            <Dropdown
              selectable
              options={lans}
              value={locale}
              onSelect={onLocaleChange}
              trigger={
                <div className="flex flex-1 justify-center">
                  <div
                    className={cn(
                      "w-8 h-8 flex justify-center items-center cursor-pointer transition-colors rounded-md",
                      "hover:bg-gray-200/60",
                      "dark:hover:bg-slate-700/70"
                    )}
                  >
                    <HiOutlineTranslate size={20} />
                  </div>
                </div>
              }
            />
            <div className="flex-1 flex justify-center">
              <div
                onClick={() => setSettingVisible(true)}
                className={cn(
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
    </Drawer>
  );
};

export default MobileMenu;
