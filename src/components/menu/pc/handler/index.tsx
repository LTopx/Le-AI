import React from "react";
import type { DropdownOption } from "@ltopx/lx-ui";
import { checkAuth } from "@/lib/checkEnv";
import Tokens from "@/components/site/tokens";
import LicenseActivate from "./licenseActivate";
import LanguageSelect from "./languageSelect";
import SettingMenus from "./settingMenus";
import Notice from "../../notice";
import Github from "./github";
import Telegram from "./telegram";

export const languages: DropdownOption[] = [
  { label: "🇺🇸 English", value: "en" },
  { label: "🇨🇳 简体中文", value: "zh-CN" },
  { label: "🇭🇰 繁体中文", value: "zh-HK" },
  // { label: "🇯🇵 日本語", value: "ja" },
];

export default function Handler() {
  return (
    <div className="border-t flex flex-col pt-2 gap-1 dark:border-white/20">
      {checkAuth() && <LicenseActivate />}
      <Tokens />
      <Notice />
      <div className="flex h-11 items-center justify-center">
        <Github />
        <Telegram />
        <LanguageSelect />
        <SettingMenus />
      </div>
    </div>
  );
}
