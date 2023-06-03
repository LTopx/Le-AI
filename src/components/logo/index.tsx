"use client";

import * as React from "react";
import { useRouter } from "next-intl/client";
import { cn } from "@/lib";
import pkg from "../../../package.json";

interface LogoProps {
  disabled?: boolean;
  share?: boolean;
  version?: boolean;
  size?: "default" | "large";
}

const Logo: React.FC<LogoProps> = ({
  disabled = false,
  share = false,
  version = true,
  size = "default",
}) => {
  const router = useRouter();

  const onClick = () => {
    if (disabled) return;
    router.push("/");
  };

  const onCheckChangeLog = () => {
    window.open(
      `https://docs.ltopx.com/change-log#v${pkg.version.replace(/\./g, "")}`
    );
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        { "text-2xl": size === "default" },
        { "text-4xl": size === "large" }
      )}
    >
      <div
        className="flex items-center gap-2 cursor-pointer select-none text-transparent font-extrabold"
        onClick={onClick}
      >
        <span className="bg-clip-text bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
          L-GPT
        </span>
        {!!share && <span className="bg-clip-text bg-share-ico">Share</span>}
      </div>
      {!!version && (
        <span
          className="text-xs cursor-pointer font-semibold py-1.5 px-3 bg-slate-400/10 rounded-full"
          onClick={onCheckChangeLog}
        >
          v{pkg.version}
        </span>
      )}
    </div>
  );
};

export default Logo;
