import React from "react";
import { useTranslations } from "next-intl";
import type { DropdownOption } from "@ltopx/lx-ui";
import Icon from "@/components/icon";
import { useOpenStore } from "@/hooks/useOpen";
import { cn } from "@/lib";
import { checkAuth } from "@/lib/checkEnv";
import Tokens from "@/components/site/tokens";
import LicenseActivate from "./licenseActivate";
import ToggleTheme from "./toggleTheme";
import LanguageSelect from "./languageSelect";

export const languages: DropdownOption[] = [
  { label: "🇨🇳 简体中文", value: "zh-CN" },
  { label: "🇺🇸 English", value: "en" },
];

export default function Handler() {
  const tMenu = useTranslations("menu");

  const updateSettingOpen = useOpenStore((state) => state.updateSettingOpen);

  return (
    <div className="border-t flex flex-col pt-2 gap-1 dark:border-white/20">
      {checkAuth() && <LicenseActivate />}
      <a
        className={cn(
          "hover:bg-gray-200/60 h-11 rounded-lg transition-colors text-sm cursor-pointer flex items-center gap-2 px-2",
          "dark:hover:bg-slate-700/70 hover:text-sky-400"
        )}
        href="https://t.me/+7fLJJoGV_bJhYTk1"
        target="_blank"
      >
        <Icon icon="telegram_fill" size={18} className="text-[#3aa9ea]" />
        {tMenu("join-tg")}
      </a>
      <Tokens />
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
            <Icon icon="github_line" size={18} />
          </a>
        </div>
        <ToggleTheme />
        <LanguageSelect />
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
