import React from "react";
import { useTranslations } from "next-intl";
import { Confirm, Button } from "@ltopx/lx-ui";
import { cn } from "@/lib";
import Icon from "@/components/icon";

export default function ResetData() {
  const tSetting = useTranslations("setting");

  const onResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between py-2 px-1 border-b",
        "border-slate-100 dark:border-neutral-500/60"
      )}
    >
      <div className="text-sm">{tSetting("reset-data")}</div>
      <Confirm
        title={tSetting("reset-data")}
        content={tSetting("reset-data-tip")}
        type="danger"
        onOk={onResetData}
      >
        <Button type="danger">
          <Icon icon="delete_2_line" size={18} />
        </Button>
      </Confirm>
    </div>
  );
}
