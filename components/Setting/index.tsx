import * as React from "react";
import { useTranslation } from "next-i18next";
import { Modal, Select } from "@/components";
import { AI_MODELS } from "@/utils/models";
import { useSettingOpen } from "@/state";
import OpenAI from "./openai";
import Azure from "./azure";

const Setting: React.FC = () => {
  const open = useSettingOpen((state) => state.open);
  const setOpen = useSettingOpen((state) => state.update);
  const [model, setModel] = React.useState<string>("");

  const { t } = useTranslation("setting");

  const onClose = () => setOpen(false);

  const renderLabel = (item: any) => {
    return (
      <div className="flex items-center gap-2">
        {item.ico}
        {item.label}
      </div>
    );
  };

  React.useEffect(() => {
    if (open && !model) setModel(AI_MODELS[0].value);
  }, [open]);

  return (
    <Modal
      footer={null}
      maskClosable={false}
      title={t("title")}
      open={open}
      onClose={onClose}
    >
      <div className="px-1">
        <Select
          className="w-full"
          size="large"
          options={AI_MODELS}
          value={model}
          renderLabel={renderLabel}
          onChange={setModel}
        />
      </div>
      {model === AI_MODELS[0].value && <OpenAI />}
      {model === AI_MODELS[1].value && <Azure />}
    </Modal>
  );
};

Setting.displayName = "Setting";

export default Setting;
