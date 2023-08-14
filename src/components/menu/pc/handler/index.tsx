import React from "react";
import { useTranslations } from "next-intl";
import { Tooltip } from "@ltopx/lx-ui";
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
  const tCommon = useTranslations("common");
  const tMenu = useTranslations("menu");

  const updateSettingOpen = useOpenStore((state) => state.updateSettingOpen);

  return (
    <div className="border-t flex flex-col pt-2 gap-1 dark:border-white/20">
      {checkAuth() && <LicenseActivate />}
      <Tokens />
      <div
        className={cn(
          "h-11 transition-colors text-sm flex items-center gap-2 px-2"
        )}
      >
        <Tooltip
          title={tMenu("join-tg")}
          triggerClassName={cn(
            "flex-1 flex justify-center items-center h-6 cursor-pointer rounded-md transition-colors",
            "hover:bg-gray-200/60 dark:hover:bg-slate-700/70"
          )}
        >
          <div
            onClick={() =>
              window.open("https://t.me/+7fLJJoGV_bJhYTk1", "_blank")
            }
          >
            <Icon icon="telegram_fill" size={18} className="text-[#3aa9ea]" />
          </div>
        </Tooltip>

        <div className="flex-1 flex justify-center px-2 border-l border-r">
          <a
            className="hover:underline transition-colors hover:text-sky-500"
            href="https://docs.ltopx.com/privacy"
            target="_blank"
          >
            {tCommon("privacy")}
          </a>
        </div>
        <div className="flex-1 flex justify-center">
          <a
            className="hover:underline transition-colors hover:text-sky-500"
            href="https://goethan.cc"
            target="_blank"
          >
            {tCommon("contact-me")}
          </a>
        </div>
      </div>
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
