"use client";

import React from "react";
import * as Toast from "@radix-ui/react-toast";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib";
import { Icon } from "@/components/ui";
import check_line from "@iconify/icons-mingcute/check-line";
import pkg from "../../../package.json";

export default function Announcement() {
  const locale = useLocale();
  const t = useTranslations("zLog");

  const [open, setOpen] = React.useState(false);

  const url =
    locale === "zh-CN"
      ? "https://docs.ltopx.com/zh-CN/change-log"
      : "https://docs.ltopx.com/change-log";

  const onClick = () => {
    localStorage.setItem("announcement_version", pkg.version);
  };

  React.useEffect(() => {
    const announcement_version = localStorage.getItem("announcement_version");
    if (pkg.version !== announcement_version) setOpen(true);
  }, []);

  return (
    <Toast.Provider swipeDirection="right" swipeThreshold={5000}>
      <Toast.Root
        className={cn(
          "bg-white border rounded-md shadow-md p-[15px] data-[state=open]:animate-slideIn data-[state=closed]:animate-hide",
          "dark:bg-neutral-800 dark:border-neutral-500"
        )}
        open={open}
        onOpenChange={setOpen}
        duration={9999999}
      >
        <Toast.Title className="font-medium text-lg mb-[5px]">
          {t("title")}
        </Toast.Title>
        <Toast.Description asChild className="text-sm mb-4">
          <div className="pl-4">
            <ul
              className={cn(
                "list-disc space-y-2 text-black/80 dark:text-white/80 marker:text-sky-400"
              )}
            >
              <li>{t("text1")}</li>
              <li>{t("text2")}</li>
              <li>{t("text3")}</li>
              <li>{t("text4")}</li>
            </ul>
            <div className="mt-3 mb-4">
              <a
                href={url}
                target="_blank"
                className="text-sky-400 cursor-pointer transition-colors hover:underline hover:text-sky-500"
              >
                {t("full-log")}
              </a>
            </div>
          </div>
        </Toast.Description>
        <Toast.Action asChild altText="Check">
          <button
            onClick={onClick}
            className={cn(
              "transition-all duration-100 ease-linear rounded-md font-medium flex items-center justify-center gap-2 tracking-wide h-8 text-sm px-3",
              "bg-sky-400 hover:bg-sky-500 active:bg-sky-600 text-white dark:bg-sky-400/90 dark:hover:bg-sky-500/90 dark:active:bg-sky-600/90"
            )}
          >
            <Icon icon={check_line} />
          </button>
        </Toast.Action>
      </Toast.Root>

      <Toast.Viewport className="flex flex-col list-none outline-none p-[var(--viewport-padding)] m-0 max-w-[100vw] right-0 bottom-0 w-[390px] z-[2147483647] gap-[10px] fixed [--viewport-padding:_25px]" />
    </Toast.Provider>
  );
}
