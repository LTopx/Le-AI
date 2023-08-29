import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib";
import Icon from "@/components/icon";
import Activate from "@/components/premium/activate";

export default function LicenseActivate() {
  const activateRef = React.useRef<any>(null);

  const tGlobal = useTranslations("global");

  const onActivate = () => activateRef.current?.init();

  return (
    <>
      <div
        onClick={onActivate}
        className={cn(
          "h-11 rounded-md text-sm cursor-pointer flex items-center gap-2 px-2 transition-colors",
          "hover:bg-gray-200/60 text-sky-400",
          "dark:hover:bg-slate-700/70 dark:text-sky-500"
        )}
      >
        <Icon icon="key_2_line" size={16} />
        {tGlobal("license-activate")}
      </div>
      <Activate ref={activateRef} />
    </>
  );
}
