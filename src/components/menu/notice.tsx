import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib";
import Icon from "@/components/icon";

export default function Notice() {
  const tZLog = useTranslations("zLog");

  return (
    <a
      className={cn(
        "h-11 rounded-lg transition-colors text-sm cursor-pointer flex items-center gap-2 px-2",
        "hover:bg-gray-200/60 dark:hover:bg-slate-700/70"
      )}
      href="https://home.le-ai.app"
      target="_blank"
    >
      <Icon icon="bell_ringing_line" size={18} className="text-emerald-400" />
      <div className="flex flex-1 gap-2 items-center group text-emerald-400">
        {tZLog("menu-notice")}
      </div>
    </a>
  );
}
