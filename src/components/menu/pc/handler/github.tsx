import React from "react";
import { cn } from "@/lib";
import Icon from "@/components/icon";

export default function Github() {
  return (
    <div className="flex flex-1 justify-center">
      <a
        href="https://github.com/LTopx/Le-AI"
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
  );
}
