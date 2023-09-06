import React from "react";
import Icon from "@/components/icon";
import { cn } from "@/lib";

export default function Telegram() {
  return (
    <div className="flex flex-1 justify-center">
      <a
        href="https://t.me/+7fLJJoGV_bJhYTk1"
        target="_blank"
        className={cn(
          "w-8 h-8 flex justify-center items-center cursor-pointer transition-colors rounded-md",
          "hover:bg-gray-200/60",
          "dark:hover:bg-slate-700/70"
        )}
      >
        <Icon icon="telegram_fill" className="text-[#3aa9ea]" size={22} />
      </a>
    </div>
  );
}
