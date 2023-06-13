"use client";

import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import { useTranslations } from "next-intl";
import { AiOutlineCheck } from "react-icons/ai";
import { cn } from "@/lib";
import pkg from "../../../package.json";

export default function Announcement() {
  const t = useTranslations("zLog");

  const [open, setOpen] = React.useState(false);

  const onClick = () => {
    localStorage.setItem("announcement_version", pkg.version);
  };

  React.useEffect(() => {
    // const announcement_version = localStorage.getItem("announcement_version");
    // if (pkg.version !== announcement_version) setOpen(true);
  }, []);

  return (
    <Toast.Provider swipeDirection="right" swipeThreshold={5000}>
      <Toast.Root
        className="bg-white border rounded-md shadow-md p-[15px] data-[state=open]:animate-slideIn data-[state=closed]:animate-hide"
        open={open}
        onOpenChange={setOpen}
        duration={9999999}
      >
        <Toast.Title className="font-medium text-lg mb-[5px]">
          {t("title")}
        </Toast.Title>
        <Toast.Description asChild className="text-sm mb-4 pl-4">
          <ul className="list-disc space-y-2 text-black/80 dark:text-white/80">
            <li>{t("text1")}</li>
            <li>{t("text2")}</li>
            <li>{t("text3")}</li>
            <li>{t("text4")}</li>
          </ul>
        </Toast.Description>
        <Toast.Action asChild altText="Check">
          <button
            onClick={onClick}
            className={cn(
              "transition-all duration-100 ease-linear rounded-md font-medium flex items-center justify-center gap-2 tracking-wide h-8 text-sm px-3",
              "bg-sky-400 hover:bg-sky-500 active:bg-sky-600 text-white dark:bg-sky-400/90 dark:hover:bg-sky-500/90 dark:active:bg-sky-600/90"
            )}
          >
            <AiOutlineCheck />
          </button>
        </Toast.Action>
      </Toast.Root>

      <Toast.Viewport className="flex flex-col list-none outline-none p-[var(--viewport-padding)] m-0 max-w-[100vw] right-0 bottom-0 w-[390px] z-[2147483647] gap-[10px] fixed [--viewport-padding:_25px]" />
    </Toast.Provider>
  );
}
