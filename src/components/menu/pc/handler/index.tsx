import React from "react";
import { checkAuth } from "@/lib/checkEnv";
import Tokens from "@/components/site/tokens";
import LicenseActivate from "./licenseActivate";
import LanguageSelect from "./languageSelect";
import SettingMenus from "./settingMenus";
import Notice from "../../notice";
import Github from "./github";
import Telegram from "./telegram";

export default function Handler() {
  return (
    <div className="border-t flex flex-col pt-2 gap-1 dark:border-white/20">
      {checkAuth() && <LicenseActivate />}
      <Tokens />
      {/* <Notice /> */}
      <div className="flex h-11 items-center justify-center">
        <Github />
        <Telegram />
        <LanguageSelect />
        <SettingMenus />
      </div>
    </div>
  );
}
