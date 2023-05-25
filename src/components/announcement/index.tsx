"use client";

import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import { useTranslations } from "next-intl";
import { AiOutlineCheck } from "react-icons/ai";
import { cn } from "@/lib";
import pkg from "../../../package.json";

const Announcement: React.FC = () => {
  const t = useTranslations("zLog");

  const [open, setOpen] = React.useState(false);

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
        className="bg-white rounded-md shadow-md border p-[15px] data-[state=open]:animate-slideIn data-[state=closed]:animate-hide"
        open={open}
        onOpenChange={setOpen}
        duration={9999999}
      >
        <Toast.Title className="mb-[5px] font-medium text-lg">
          {t("title")}
        </Toast.Title>
        <Toast.Description asChild className="mb-4 pl-4 text-sm">
          <ul className="list-disc space-y-2 text-black/80 dark:text-white/80">
            <li>{t("text1")}</li>
            <li>{t("text2")}</li>
            <li>{t("text3")}</li>
            <li>{t("text4")}</li>
            <li>{t("text5")}</li>
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

      <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </Toast.Provider>
  );
};

export default Announcement;
