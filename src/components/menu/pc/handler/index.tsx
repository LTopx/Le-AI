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
import LanguageSelect from "./languageSelect";
import SettingMenus from "./settingMenus";
import Notice from "../../notice";
import Github from "./github";

export const languages: DropdownOption[] = [
  { label: "🇺🇸 English", value: "en" },
  { label: "🇨🇳 简体中文", value: "zh-CN" },
  { label: "🇭🇰 繁体中文", value: "zh-HK" },
  // { label: "🇯🇵 日本語", value: "ja" },
];

export default function Handler() {
  const tGlobal = useTranslations("global");

  const updateBackupOpen = useOpenStore((state) => state.updateBackupOpen);

  return (
    <div className="border-t flex flex-col pt-2 gap-1 dark:border-white/20">
      {checkAuth() && <LicenseActivate />}
      <Tokens />
      <Notice />
      <div className="flex h-11 items-center justify-center">
        <Github />
        <LanguageSelect />
        <Tooltip
          title={tGlobal("backup-sync")}
          triggerClassName="flex flex-1 justify-center"
        >
          <div
            className={cn(
              "w-8 h-8 flex justify-center items-center cursor-pointer transition-colors rounded-md",
              "hover:bg-gray-200/60",
              "dark:hover:bg-slate-700/70"
            )}
            onClick={() => updateBackupOpen(true)}
          >
            <Icon icon="cloud_line" size={22} />
          </div>
        </Tooltip>
        <SettingMenus />
      </div>
    </div>
  );
}
