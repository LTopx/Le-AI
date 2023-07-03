import React from "react";
import { useTranslations } from "next-intl";
import Icon from "@/components/icon";
import { Divider, Input, Modal, Select, Tooltip } from "@/components/ui";
import { useChannel, useLLM, useModel, useConversationSetting } from "@/hooks";
import { cn, isUndefined } from "@/lib";

interface IConversationSettings {
  name: string;
  model_type: string;
  model_value: string;
  context_length: number;
}

const renderLabel = (item: any) => {
  return (
    <div className="flex gap-2 items-center">
      {item.ico}
      {item.label}
    </div>
  );
};

const renderModelLabel = (item: any) => {
  return (
    <div className="flex gap-4 items-center">
      <span className="truncate">{item.label}</span>
      {!!item.premium && (
        <span
          className={cn(
            "select-none rounded text-xs py-0.5 px-2 border",
            "border-amber-400 text-amber-400 bg-amber-50",
            "dark:border-orange-500 dark:text-orange-500 dark:bg-orange-50/90"
          )}
        >
          PREMIUM
        </span>
      )}
    </div>
  );
};

const lengthOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e) => ({
  label: String(e),
  value: e,
}));

const ChangeTitle: React.FC = () => {
  const tChat = useTranslations("chat");
  const tCommon = useTranslations("common");
  const tPrompt = useTranslations("prompt");

  const [channel, setChannel] = useChannel();
  const { updateType, updateName } = useModel();
  const [open, setOpen] = useConversationSetting();
  const { openai, azure } = useLLM();
  const LLMOptions = React.useMemo(() => [openai, azure], [openai, azure]);
  const [modelOptions, setModelOptions] = React.useState<any[]>([]);
  const [formData, setFormData] = React.useState<IConversationSettings>({
    name: "",
    model_type: "",
    model_value: "",
    context_length: 8,
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

  const onChangeForm = (value: any, key: keyof IConversationSettings) => {
    setFormData((data: IConversationSettings) => {
      const newData = JSON.parse(JSON.stringify(data));
      newData[key] = value;
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
      const findCh = list.find((item) => item.channel_id === activeId);
      if (!findCh) return channel;
      findCh.channel_name = formData.name;
      findCh.channel_model.type = formData.model_type;
      findCh.channel_model.name = formData.model_value;
      findCh.channel_context_length = formData.context_length;
      updateType(formData.model_type);
      updateName(formData.model_value);
      return channel;
    });
    onClose();
  };

  React.useEffect(() => {
    if (open) {
      const { activeId, list } = channel;
      const findCh = list.find((item) => item.channel_id === activeId);
      if (!findCh) return;

      const { channel_name, channel_model, channel_context_length } = findCh;

      let context_length = 8;
      if (!isUndefined(channel_context_length)) {
        context_length = channel_context_length;
      }

      setFormData({
        name: channel_name,
        model_type: channel_model.type,
        model_value: channel_model.name,
        // default is 8
        context_length,
      });
      getModelOptions(findCh.channel_model.type);
    }
  }, [open]);

  return (
    <Modal
      title={tChat("conversation-setting")}
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
        <div className="flex mt-2 items-center">
          <div className="text-sm text-black/90 w-36 dark:text-white/90">
            {tPrompt("model")}
          </div>
          <div className="flex-1">
            <Select
              className="w-full"
              options={modelOptions}
              renderLabel={renderModelLabel}
              value={formData.model_value}
              onChange={(value) => onChangeForm(value, "model_value")}
            />
          </div>
        </div>
      </div>
      <Divider />
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <div className="text-sm text-black/90 w-36  dark:text-white/90">
            {tChat("title")}
          </div>
          <Input
            className="flex-1"
            allowClear
            maxLength={30}
            placeholder={tCommon("please-enter") as string}
            value={formData.name}
            onChange={(value) => onChangeForm(value, "name")}
          />
        </div>
        <div className="flex items-center">
          <div className="text-sm text-black/90 w-36 dark:text-white/90 flex items-center gap-1">
            <span>{tChat("context-limit")}</span>
            <Tooltip title={tChat("context-limit-tip")}>
              <Icon icon="question_line" size={18} />
            </Tooltip>
          </div>
          <Select
            className="flex-1"
            options={lengthOptions}
            value={formData.context_length}
            onChange={(value) => onChangeForm(value, "context_length")}
          />
        </div>
      </div>
    </Modal>
  );
};

ChangeTitle.displayName = "ChangeTitle";

export default ChangeTitle;
