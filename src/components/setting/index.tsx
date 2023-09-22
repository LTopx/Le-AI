import React from "react";
import { useTranslations } from "next-intl";
import { Modal, Button } from "@ltopx/lx-ui";
import { useOpenStore } from "@/hooks/useOpen";
import { cn } from "@/lib";
import { checkTTS } from "@/lib/checkEnv";
import Icon from "@/components/icon";
import ApiKey from "./apiKey";
import ResetData from "./resetData";
import ImportExport from "./importExport";
import SendMessageType from "./sendMessageType";

export default function Setting() {
  const tGlobal = useTranslations("global");
  const tTTS = useTranslations("tts");
  const tPlugin = useTranslations("plugin");

  const [open, setOpen] = useOpenStore((state) => [
    state.settingOpen,
    state.updateSettingOpen,
  ]);

  const updateTtsSettingOpen = useOpenStore(
    (state) => state.updateTtsSettingOpen
  );

  const updatePluginSettingOpen = useOpenStore(
    (state) => state.updatePluginSettingOpen
  );

  const onClose = () => setOpen(false);

  React.useEffect(() => {
    return () => {
      onClose();
    };
  }, []);

  return (
    <Modal
      title={`Le-AI ${tGlobal("setting")}`}
      open={open}
      onClose={onClose}
      footer={null}
    >
      <ApiKey />
      <ResetData />
      <ImportExport />
      <SendMessageType />
      {checkTTS() && (
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
      )}
      <div
        className={cn(
          "flex items-center justify-between py-2 px-1 border-b",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="text-sm">{tPlugin("config")}</div>
        <Button type="primary" onClick={() => updatePluginSettingOpen(true)}>
          <Icon icon="settings_3_line" size={18} />
        </Button>
      </div>
    </Modal>
  );
}
