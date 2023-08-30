"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useRouter } from "next-intl/client";
import { cn } from "@/lib";
import pkg from "../../../package.json";

export default function Logo({
  disabled = false,
  share = false,
  version = true,
  size = "base",
}) {
  const router = useRouter();
  const locale = useLocale();

  const [isNew, setNew] = React.useState(false);

  const onClick = () => {
    if (disabled) return;
    router.push("/");
  };

  const onCheckLog = () => {
    localStorage.setItem("is_new_version", pkg.version);
    const version = pkg.version.replace(/\./g, "");
    const url = `https://docs.le-ai.app/change-log#v${version}`;
    window.open(url);
  };

  React.useEffect(() => {
    const is_new_version = localStorage.getItem("is_new_version");
    if (pkg.version !== is_new_version) setNew(true);
  }, []);

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        { "text-2xl": size === "base" },
        { "text-4xl": size === "large" }
      )}
    >
      <Image src="/logo.png" alt="logo" width={30} height={30} />
      <div
        className="flex font-extrabold text-transparent gap-2 items-center cursor-pointer select-none"
        onClick={onClick}
      >
        <span className="bg-clip-text animate-flow bg-logo bg-[size:400%]">
          Le-AI
        </span>
        {!!share && (
          <span className="bg-clip-text bg-share-ico animate-flow bg-[size:400%]">
            Share
          </span>
        )}
      </div>
      {!!version && (
        <span
          className="text-xs cursor-pointer font-semibold ml-3 py-1.5 px-3 bg-slate-400/20 rounded-full tabular-nums relative"
          onClick={onCheckLog}
        >
          v{pkg.version}
          {isNew && (
            <div className="absolute bg-red-400 text-white rounded-full py-0.5 px-1 -right-6 -top-1.5">
              New
            </div>
          )}
        </span>
      )}
    </div>
  );
}
