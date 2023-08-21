import React from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Tooltip } from "@ltopx/lx-ui";
import { cn } from "@/lib";
import { checkAuth } from "@/lib/checkEnv";
import { useOpenStore } from "@/hooks/useOpen";
import Icon from "@/components/icon";
import Tokens from "@/components/site/tokens";
import LicenseActivate from "./licenseActivate";
import LanguageSelect from "../../pc/handler/languageSelect";
import SettingMenus from "../../pc/handler/settingMenus";
import Notice from "../../notice";

export default function Handler() {
  const session = useSession();

  const tCommon = useTranslations("common");

  const updateBackupOpen = useOpenStore((state) => state.updateBackupOpen);

  const height = React.useMemo(() => {
    if (session.data) return "h-[12rem]";
    if (!checkAuth()) return "h-[6rem]";
    return "h-[9rem]";
  }, [session.data]);

  return (
    <div className={cn("flex flex-col border-t gap-1 pt-1", height)}>
      {checkAuth() && <LicenseActivate />}
      <Tokens mobile />
      <Notice />
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
        <LanguageSelect mobile />
        <Tooltip
          title={tCommon("backup-sync")}
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
