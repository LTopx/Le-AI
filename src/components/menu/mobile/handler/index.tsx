import React from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import type { DropdownOption } from "@ltopx/lx-ui";
import { cn } from "@/lib";
import { useOpenStore } from "@/hooks/useOpen";
import Icon from "@/components/icon";
import Tokens from "@/components/site/tokens";
import LicenseActivate from "./licenseActivate";
import ToggleTheme from "../../pc/handler/toggleTheme";
import LanguageSelect from "../../pc/handler/languageSelect";

export const languages: DropdownOption[] = [
  { label: "🇨🇳 简体中文", value: "zh-CN" },
  { label: "🇺🇸 English", value: "en" },
];

export default function Handler() {
  const session = useSession();

  const tMenu = useTranslations("menu");

  const updateSettingOpen = useOpenStore((state) => state.updateSettingOpen);

  return (
    <div
      className={cn("flex flex-col border-t gap-1 pt-1", {
        "h-[12rem]": session.data,
        "h-[9rem]": !session.data,
      })}
    >
      <LicenseActivate />
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
        {tMenu("join-tg")}
      </a>
      <Tokens mobile />
      <div className="flex h-[43px] items-center justify-center">
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
            <Icon icon="github_line" size={18} />
          </a>
        </div>
        <ToggleTheme />
        <LanguageSelect mobile />
        <div className="flex flex-1 justify-center">
          <div
            onClick={() => updateSettingOpen(true)}
            className={cn(
              "w-8 h-8 flex justify-center items-center cursor-pointer transition-colors rounded-md",
              "hover:bg-gray-200/60",
              "dark:hover:bg-slate-700/70"
            )}
          >
            <Icon icon="settings_3_line" size={22} />
          </div>
        </div>
      </div>
    </div>
  );
}
