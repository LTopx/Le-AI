import React from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib";
import { checkAuth } from "@/lib/checkEnv";
import Tokens from "@/components/site/tokens";
import LicenseActivate from "./licenseActivate";
import LanguageSelect from "../../pc/handler/languageSelect";
import SettingMenus from "../../pc/handler/settingMenus";
import Telegram from "../../pc/handler/telegram";
import Github from "../../pc/handler/github";
import Notice from "../../notice";

export default function Handler() {
  const session = useSession();

  const height = React.useMemo(() => {
    if (session.data) return "h-[12rem]";
    if (!checkAuth()) return "h-[6rem]";
    return "h-[9rem]";
  }, [session.data]);

  return (
    <div className={cn("flex flex-col border-t gap-1 pt-1", height)}>
      {checkAuth() && <LicenseActivate />}
      <Tokens mobile />
      {/* <Notice /> */}
      <div className="flex h-[43px] items-center justify-center">
        <Github />
        <Telegram />
        <LanguageSelect mobile />
        <SettingMenus />
      </div>
    </div>
  );
}
