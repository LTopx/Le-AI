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
          "hover:bg-gray-200/60 h-11 rounded-lg transition-colors text-sm cursor-pointer flex items-center gap-2 px-2",
          "dark:hover:bg-slate-700/70 text-sky-400"
        )}
      >
        <Icon icon="key_2_line" size={18} />
        {tGlobal("license-activate")}
      </div>

      <Activate ref={activateRef} />
    </>
  );
}
