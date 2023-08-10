import React from "react";
import { useTranslations } from "next-intl";
import { Modal } from "@ltopx/lx-ui";
import { useOpenStore } from "@/hooks/useOpen";
import PluginSetting from "./setting";

export default function Plugin() {
  const tPlugin = useTranslations("plugin");

  const [open, setOpen] = useOpenStore((state) => [
    state.pluginSettingOpen,
    state.updatePluginSettingOpen,
  ]);

  const onClose = () => setOpen(false);

  return (
    <Modal
      title={`${tPlugin("config")} Beta`}
      maskClosable={false}
      open={open}
      onClose={onClose}
      footer={null}
    >
      <PluginSetting />
    </Modal>
  );
}
