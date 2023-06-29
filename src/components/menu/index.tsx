import React from "react";
import { useSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useRouter } from "next-intl/client";
import { useTheme } from "next-themes";
import { useDateFormat } from "l-hooks";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib";
import { useSetting, useChannel, useModel, initChannelList } from "@/hooks";
import type { ChannelListItem } from "@/hooks";
import { Button, Confirm, ContextMenu, Dropdown, Icon } from "@/components/ui";
import arrow_to_up_line from "@iconify/icons-mingcute/arrow-to-up-line";
import delete_2_line from "@iconify/icons-mingcute/delete-2-line";
import key_2_line from "@iconify/icons-mingcute/key-2-line";
import telegram_fill from "@iconify/icons-mingcute/telegram-fill";
import moon_fill from "@iconify/icons-mingcute/moon-fill";
import sun_line from "@iconify/icons-mingcute/sun-line";
import github_line from "@iconify/icons-mingcute/github-line";
import loading_line from "@iconify/icons-mingcute/loading-line";
import translate_2_line from "@iconify/icons-mingcute/translate-2-line";
import settings_3_line from "@iconify/icons-mingcute/settings-3-line";
import type { ContextMenuOption } from "@/components/ui/ContextMenu";
import type { IDropdownItems } from "@/components/ui/Dropdown";
import Logo from "@/components/site/logo";
import Tokens from "@/components/site/tokens";
import Activate from "@/components/premium/activate";
import MenuIcon from "./icon";

export const lans: IDropdownItems[] = [
  {
    label: "简体中文",
    value: "zh-CN",
    icon: "🇨🇳",
  },
  {
    label: "English",
    value: "en",
    icon: "🇺🇸",
  },
];

export default function Menu() {
  const session = useSession();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { model_type, model_name, checkModel } = useModel();
  const { theme, setTheme } = useTheme();
  const { format } = useDateFormat();
  const [, setVisible] = useSetting();
  const [channel, setChannel] = useChannel();
  const [nowTheme, setNowTheme] = React.useState<"dark" | "light">("light");
  const [loadingChangeLang, setLoadingChangeLang] = React.useState(false);

  const t = useTranslations("menu");
  const tPremium = useTranslations("premium");

  // ref
  const scrollRef = React.useRef<any>(null);
  const activateRef = React.useRef<any>(null);

  const menuItems: ContextMenuOption[] = [
    {
      label: t("to-top"),
      value: "top",
      icon: <Icon icon={arrow_to_up_line} size={18} />,
    },
    {
      label: t("delete"),
      value: "delete",
      icon: <Icon icon={delete_2_line} size={18} />,
    },
  ];

  const onChannelAdd = () => {
    const check = checkModel();

    const channel_id = uuidv4();
    const addItem = { ...initChannelList[0], channel_id };

    if (check) {
      addItem.channel_model.type = model_type;
      addItem.channel_model.name = model_name;
    }

    setChannel((channel) => {
      channel.list.push(addItem);
      channel.activeId = channel_id;
      return channel;
    });
    setTimeout(() => {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 200);
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
        const splice = list.splice(findIndex, 1);
        list.unshift(splice[0]);
        return channel;
      });
    } else if (value === "delete") {
      onChannelDelete(v.channel_id);
    }
  };

  const onToggleTheme = () => setTheme(nowTheme === "light" ? "dark" : "light");

  const onLocaleChange = (value: string) => {
    if (value === locale) return;
    setLoadingChangeLang(true);
    router.replace(value);
  };

  React.useEffect(() => {
    setNowTheme(theme === "dark" ? "dark" : "light");
  }, [theme]);

  React.useEffect(() => {
    if (loadingChangeLang) setLoadingChangeLang(false);
  }, [pathname]);

  return (
    <>
      <div
        className={cn(
          "px-2 pb-2 hidden md:block md:w-[17.5rem] transition-colors select-none",
          "bg-white dark:bg-slate-800"
        )}
      >
        <div className="flex h-14 pl-4 items-center">
          <Logo disabled />
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
        <div
          ref={scrollRef}
          className={cn("overflow-y-auto scroll-smooth", {
            "h-[calc(100vh-19.75rem)]": session.data,
            "h-[calc(100vh-16.75rem)]": !session.data,
          })}
        >
          {channel.list.map((item) => (
            <ContextMenu
              key={item.channel_id}
              options={menuItems}
              onSelect={(params) => onSelectMenu(params, item)}
            >
              <div
                onClick={() => onChannelChange(item.channel_id)}
                className={cn(
                  "rounded-lg cursor-pointer mb-1 overflow-hidden relative flex flex-col h-16 text-xs px-[0.5rem] transition-colors gap-1 group justify-center",
                  "hover:bg-gray-200/60 dark:hover:bg-slate-700/70",
                  {
                    "bg-sky-100 hover:bg-sky-100 dark:bg-slate-600 dark:hover:bg-slate-600":
                      item.channel_id === channel.activeId,
                  }
                )}
              >
                <div
                  className={cn(
                    "flex justify-between items-center",
                    "text-black/90",
                    "dark:text-white/90"
                  )}
                >
                  <div className="text-sm text-ellipsis max-w-[26ch] pl-5 transition-colors relative overflow-hidden whitespace-nowrap">
                    <MenuIcon
                      name={item.channel_icon}
                      loading={item.channel_loading}
                    />
                    <span className="font-medium">
                      {item.channel_name || t("new-conversation")}
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex justify-between transition-all",
                    "text-neutral-500/90 dark:text-neutral-500 dark:group-hover:text-neutral-400",
                    {
                      "dark:text-neutral-400":
                        item.channel_id === channel.activeId,
                    }
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
                      className={cn(
                        "opacity-0 transition-all right-[-2rem] absolute group-hover:opacity-100 group-hover:right-2",
                        "text-neutral-500/90 hover:text-black/90",
                        "dark:text-neutral-400 dark:hover:text-white/90"
                      )}
                    >
                      <Icon icon={delete_2_line} size={20} />
                    </div>
                  }
                  onOk={() => onChannelDelete(item.channel_id)}
                />
              </div>
            </ContextMenu>
          ))}
        </div>
        <div className="border-t flex flex-col pt-2 gap-1 dark:border-white/20">
          <div
            onClick={onActivate}
            className={cn(
              "hover:bg-gray-200/60 h-11 rounded-lg transition-colors text-sm cursor-pointer flex items-center gap-2 px-2",
              "dark:hover:bg-slate-700/70 text-sky-400"
            )}
          >
            <Icon icon={key_2_line} size={18} />
            {tPremium("license-activate")}
          </div>
          <a
            className={cn(
              "hover:bg-gray-200/60 h-11 rounded-lg transition-colors text-sm cursor-pointer flex items-center gap-2 px-2",
              "dark:hover:bg-slate-700/70"
            )}
            href="https://t.me/+7fLJJoGV_bJhYTk1"
            target="_blank"
          >
            <Icon icon={telegram_fill} size={18} className="text-[#3aa9ea]" />
            {t("join-tg")}
          </a>
          {!!session.data && <Tokens type="pc" />}
          <div className="flex h-11 items-center justify-center">
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
                  <Icon icon={moon_fill} size={20} />
                ) : (
                  <Icon icon={sun_line} size={20} />
                )}
              </div>
            </div>
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
                <Icon icon={github_line} size={20} />
              </a>
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
                    {loadingChangeLang ? (
                      <Icon
                        icon={loading_line}
                        size={20}
                        className="animate-spin"
                      />
                    ) : (
                      <Icon icon={translate_2_line} size={20} />
                    )}
                  </div>
                </div>
              }
            />
            <div className="flex flex-1 justify-center">
              <div
                onClick={() => setVisible(true)}
                className={cn(
                  "w-8 h-8 flex justify-center items-center cursor-pointer transition-colors rounded-md",
                  "hover:bg-gray-200/60",
                  "dark:hover:bg-slate-700/70"
                )}
              >
                <Icon icon={settings_3_line} size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Activate ref={activateRef} />
    </>
  );
}
