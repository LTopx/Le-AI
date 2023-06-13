import * as React from "react";
import { useTranslations } from "next-intl";
import { Divider, Input, Modal, Select } from "@/components/ui";
import { useChannel, useLLM } from "@/hooks";

interface IConversationSettings {
  name: string;
  model_type: string;
  model_value: string;
}

const renderLabel = (item: any) => {
  return (
    <div className="flex items-center gap-2">
      {item.ico}
      {item.label}
    </div>
  );
};

const ChangeTitle = React.forwardRef((_, forwardedRef) => {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tPrompt = useTranslations("prompt");

  const [channel, setChannel] = useChannel();
  const { openai, azure } = useLLM();
  const [open, setOpen] = React.useState(false);
  const LLMOptions = React.useMemo(() => [openai, azure], [openai, azure]);
  const [modelOptions, setModelOptions] = React.useState<any[]>([]);
  const [formData, setFormData] = React.useState<IConversationSettings>({
    name: "",
    model_type: "",
    model_value: "",
  });

  const onClose = () => setOpen(false);

  const onChangeModelType = (value: string) => {
    setFormData((data) => {
      const newData = JSON.parse(JSON.stringify(data)) as IConversationSettings;
      newData.model_type = value;
      newData.model_value =
        LLMOptions.find((val) => val.value === value)?.models[0].value || "";
      return newData;
    });
    getModelOptions(value);
  };

  const onChangeModelValue = (value: string) => {
    setFormData((data) => {
      const newData = JSON.parse(JSON.stringify(data)) as IConversationSettings;
      newData.model_value = value;
      return newData;
    });
  };

  const onChangeName = (value: string) => {
    setFormData((data) => {
      const newData = JSON.parse(JSON.stringify(data)) as IConversationSettings;
      newData.name = value;
      return newData;
    });
  };

  const getModelOptions = (type: string) => {
    const options =
      LLMOptions.find((item) => item.value === type)?.models || [];
    setModelOptions(options);
  };

  const submit = () => {
    setChannel((channel) => {
      const { activeId, list } = channel;
      const findChannel = list.find((item) => item.channel_id === activeId);
      if (!findChannel) return channel;
      findChannel.channel_name = formData.name;
      findChannel.channel_model.type = formData.model_type;
      findChannel.channel_model.name = formData.model_value;
      return channel;
    });
    onClose();
  };

  React.useImperativeHandle(forwardedRef, () => ({
    init() {
      const { activeId, list } = channel;
      const findChannel = list.find((item) => item.channel_id === activeId);
      if (!findChannel) return;

      setFormData({
        name: findChannel.channel_name,
        model_type: findChannel.channel_model.type,
        model_value: findChannel.channel_model.name,
      });
      getModelOptions(findChannel.channel_model.type);

      setOpen(true);
    },
  }));

  return (
    <Modal
      title={t("conversation-setting")}
      maskClosable={false}
      open={open}
      onClose={onClose}
      onOk={submit}
    >
      <div>
        <Select
          className="w-full"
          size="large"
          options={LLMOptions}
          value={formData.model_type}
          renderLabel={renderLabel}
          onChange={onChangeModelType}
        />
        <div className="flex items-center mt-2">
          <div className="text-sm text-black/90 dark:text-white/90 w-20">
            {tPrompt("model")}
          </div>
          <div className="flex-1">
            <Select
              className="w-full"
              options={modelOptions}
              value={formData.model_value}
              onChange={onChangeModelValue}
            />
          </div>
        </div>
      </div>
      <Divider />
      <div className="flex items-center">
        <div className="text-sm text-black/90 dark:text-white/90  w-20">
          {t("title")}
        </div>
        <Input
          className="flex-1"
          allowClear
          maxLength={30}
          placeholder={tCommon("please-enter") as string}
          value={formData.name}
          onChange={onChangeName}
        />
      </div>
    </Modal>
  );
});

ChangeTitle.displayName = "ChangeTitle";

export default ChangeTitle;
