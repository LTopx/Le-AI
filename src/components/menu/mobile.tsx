import React from "react";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next-intl/client";
import { useTheme } from "next-themes";
import { useDateFormat } from "l-hooks";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { cn } from "@/lib";
import Icon from "@/components/icon";
import { Button, Confirm, Drawer, Dropdown } from "@/components/ui";
import Logo from "@/components/site/logo";
import {
  useChannel,
  initChannelList,
  useMobileMenu,
  useSetting,
  useModel,
  useUserInfo,
} from "@/hooks";
import { lans } from "./index";
import MenuIcon from "./icon";
import Tokens from "@/components/site/tokens";
import Activate from "@/components/premium/activate";

export default function MobileMenu() {
  const session = useSession();
  const locale = useLocale();
  const router = useRouter();
  const [userInfo] = useUserInfo();
  const { model_type, model_name, checkModel } = useModel();
  const { theme, setTheme } = useTheme();
  const { format } = useDateFormat();
  const [channel, setChannel] = useChannel();
  const [mobileMenuVisible, setMobileMenuVisible] = useMobileMenu();
  const [, setSettingVisible] = useSetting();

  const [nowTheme, setNowTheme] = React.useState<any>("");

  const t = useTranslations("menu");
  const tChat = useTranslations("chat");
  const tPremium = useTranslations("premium");

  const activateRef = React.useRef<any>(null);

  const onClose = () => setMobileMenuVisible(false);

  const onChannelAdd = () => {
    const { license_type } = userInfo;

    if (
      channel.list.length >= 10 &&
      license_type !== "premium" &&
      license_type !== "team"
    ) {
      return toast.error(tChat("conversation-limit"), {
        id: "conversation-limit",
      });
    }

    const check = checkModel();

    const channel_id = uuidv4();
    const addItem = { ...initChannelList[0], channel_id };

    if (check) {
      addItem.channel_model.type = model_type;
      addItem.channel_model.name = model_name;
    }

    setChannel((channel) => {
      channel.list.unshift(addItem);
      channel.activeId = channel_id;
      return channel;
    });

    onClose();
  };

  const onActivate = () => activateRef.current?.init();

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
    if (id === channel.activeId) return onClose();
    setChannel((channel) => {
      channel.activeId = id;
      return channel;
    });
    onClose();
  };

  const onToggleTheme = () => setTheme(nowTheme === "light" ? "dark" : "light");

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
    <>
      <Drawer
        className="md:hidden"
        overlayClassName="md:hidden"
        title={
          <div className="flex h-full pl-2 items-center">
            <Logo disabled />
          </div>
        }
        width="78%"
        open={mobileMenuVisible}
        onClose={onClose}
      >
        <div className="flex flex-col h-[calc(100%-3.5rem)] p-2">
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
                <div className="flex gap-2 justify-between items-center">
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
                      <Icon icon="delete_2_line" size={20} />
                    </div>
                  }
                  onOk={() => onChannelDelete(item.channel_id)}
                />
              </div>
            ))}
          </div>
          <div
            className={cn("flex flex-col border-t gap-1 pt-1", {
              "h-[12rem]": session.data,
              "h-[9rem]": !session.data,
            })}
          >
            <div
              onClick={onActivate}
              className={cn(
                "h-11 rounded-md text-sm cursor-pointer flex items-center gap-2 px-2 transition-colors",
                "hover:bg-gray-200/60 text-sky-400",
                "dark:hover:bg-slate-700/70 text-sky-400"
              )}
            >
              <Icon icon="key_2_line" size={16} />
              {tPremium("license-activate")}
            </div>
            <a
              className={cn(
                "h-11 rounded-md text-sm cursor-pointer flex items-center gap-2 px-2 transition-colors",
                "hover:bg-gray-200/60 text-black/90",
                "dark:hover:bg-slate-700/70 dark:text-white/90"
              )}
              href="https://t.me/+7fLJJoGV_bJhYTk1"
              target="_blank"
            >
              <Icon icon="telegram_fill" size={16} className="text-[#3aa9ea]" />
              {t("join-tg")}
            </a>
            {!!session.data && <Tokens type="mobile" />}
            <div className="flex h-11 items-center justify-center">
              <div className="flex flex-1 justify-center">
                <a
                  href="https://github.com/Peek-A-Booo/L-GPT"
                  target="_blank"
                  className={cn(
                    "w-8 h-8 flex justify-center items-center cursor-pointer transition-colors rounded-md",
                    "hover:bg-gray-200/60",
                    "dark:hover:bg-slate-700/70"
                  )}
                >
                  <Icon icon="github_line" size={20} />
                </a>
              </div>
              <div className="flex flex-1 justify-center">
                <div
                  onClick={onToggleTheme}
                  className={cn(
                    "w-8 h-8 flex justify-center items-center cursor-pointer transition-colors rounded-md",
                    "hover:bg-gray-200/60",
                    "dark:hover:bg-slate-700/70"
                  )}
                >
                  {nowTheme === "light" ? (
                    <Icon icon="moon_fill" size={22} />
                  ) : (
                    <Icon icon="sun_line" size={22} />
                  )}
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
                      <Icon icon="translate_2_line" size={22} />
                    </div>
                  </div>
                }
              />
              <div className="flex flex-1 justify-center">
                <div
                  onClick={() => setSettingVisible(true)}
                  className={cn(
                    "w-8 h-8 flex justify-center items-center cursor-pointer transition-colors rounded-md",
                    "hover:bg-gray-200/60",
                    "dark:hover:bg-slate-700/70"
                  )}
                >
                  <Icon icon="settings_3_line" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
      <Activate ref={activateRef} />
    </>
  );
}
