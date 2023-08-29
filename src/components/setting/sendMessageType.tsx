import React from "react";
import { useTranslations } from "next-intl";
import { Select } from "@ltopx/lx-ui";
import { cn, getPlatform, type Platform } from "@/lib";
import { sendMessageTypes } from "@/utils/constant";
import { useConfigStore, type ConfigStore } from "@/hooks/useConfig";

export default function SendMessageType() {
  const tGlobal = useTranslations("global");

  const sendMessageType = useConfigStore((state) => state.sendMessageType);
  const [plat, setPlat] = React.useState<Platform>("windows");

  const updateSendMessageType = useConfigStore(
    (state) => state.updateSendMessageType
  );

  const onChange = (value: string) => {
    updateSendMessageType(value as ConfigStore["sendMessageType"]);
  };

  React.useEffect(() => {
    setPlat(getPlatform());
  }, []);

  return (
    <div
      className={cn(
        "flex items-center justify-between py-2 px-1 border-b",
        "border-slate-100 dark:border-neutral-500/60"
      )}
    >
      <div className="text-sm">{tGlobal("send-message")}</div>
      <Select
        className="w-40"
        options={sendMessageTypes(plat)}
        value={sendMessageType}
        onChange={onChange}
      />
    </div>
  );
}
