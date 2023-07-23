import React from "react";
import { useTranslations } from "next-intl";
import { shallow } from "zustand/shallow";
import { Modal, Confirm, Button } from "@ltopx/lx-ui";
import { useOpenStore } from "@/hooks/useOpen";
import { cn } from "@/lib";
import Icon from "@/components/icon";
import ApiKey from "./apiKey";
import ImportExport from "./importExport";
import SendMessageType from "./sendMessageType";

export default function Setting() {
  const tSetting = useTranslations("setting");
  const tTTS = useTranslations("tts");

  const [open, setOpen] = useOpenStore(
    (state) => [state.settingOpen, state.updateSettingOpen],
    shallow
  );

  const updateTtsSettingOpen = useOpenStore(
    (state) => state.updateTtsSettingOpen
  );

  const onClose = () => setOpen(false);

  const onResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  React.useEffect(() => {
    return () => {
      onClose();
    };
  }, []);

  return (
    <Modal
      title={tSetting("title")}
      open={open}
      onClose={onClose}
      footer={null}
    >
      <ApiKey />
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
      <ImportExport />
      <SendMessageType />
      <div
        className={cn(
          "flex items-center justify-between py-2 px-1 border-b",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="text-sm">{tTTS("azure-tts")}</div>
        <Button type="primary" onClick={() => updateTtsSettingOpen(true)}>
          <Icon icon="settings_3_line" size={18} />
        </Button>
      </div>
    </Modal>
  );
}
