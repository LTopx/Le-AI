import React from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  Divider,
  Input,
  Tooltip,
  Textarea,
  Switch,
} from "@ltopx/lx-ui";
import { useLLMStore } from "@/hooks/useLLM";
import { useChannelStore } from "@/hooks/useChannel";
import type { ChannelListItem } from "@/hooks/useChannel/types";
import { useModelCacheStore } from "@/hooks/useModelCache";
import { usePluginStore } from "@/hooks/usePlugin";
import { cn, isUndefined } from "@/lib";
import Icon from "@/components/icon";

interface ChatSettingFormProps {
  onClose: () => void;
}

interface IConversationSettings {
  name: string;
  model_type: string;
  model_value: string;
  context_length: string;
  prompt: string;
  plugins: string[];
}

const lengthOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e) => ({
  label: String(e),
  value: String(e),
}));

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
      <div className="flex items-center gap-1.5">
        {!!item.icon && <span>{item.icon}</span>}
        <span>{item.label}</span>
      </div>
      {!!item.premium && (
        <span
          className={cn(
            "select-none rounded text-xs py-0.5 px-2 border",
            "border-amber-400 text-amber-400 bg-amber-50",
            "dark:border-orange-500 dark:text-orange-500 dark:bg-orange-50/90"
          )}
        >
          PRO
        </span>
      )}
    </div>
  );
};

const ChatSettingForm = React.forwardRef<any, ChatSettingFormProps>(
  ({ onClose }, forwardedRef) => {
    const tChat = useTranslations("chat");
    const tCommon = useTranslations("common");
    const tPrompt = useTranslations("prompt");
    const tPlugin = useTranslations("plugin");

    const [openai, azure, openRouter] = useLLMStore((state) => [
      state.openai,
      state.azure,
      state.openRouter,
    ]);
    const LLMOptions = React.useMemo(
      () => [openai, azure, openRouter],
      [openai, azure, openRouter]
    );
    const [activeId, list] = useChannelStore((state) => [
      state.activeId,
      state.list,
    ]);
    const [google_search] = usePluginStore((state) => [state.google_search]);

    const count = React.useMemo(() => {
      return Number(!!google_search.enable);
    }, [google_search.enable]);

    const updateList = useChannelStore((state) => state.updateList);
    const updatePlugin = useChannelStore((state) => state.updatePlugin);
    const updateType = useModelCacheStore((state) => state.updateType);
    const updateName = useModelCacheStore((state) => state.updateName);

    const [modelOptions, setModelOptions] = React.useState<any[]>([]);

    const [formData, setFormData] = React.useState<IConversationSettings>({
      name: "",
      model_type: "",
      model_value: "",
      context_length: "8",
      prompt: "",
      plugins: [],
    });

    const getModelOptions = (type: string) => {
      const options =
        LLMOptions.find((item) => item.value === type)?.models || [];
      setModelOptions(options);
    };

    const onChangeModelType = (value: string) => {
      setFormData((data) => {
        const newData = JSON.parse(
          JSON.stringify(data)
        ) as IConversationSettings;
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

    const onToggle = (value: boolean, key: string) => {
      let plugins: string[] = [];
      if (value) {
        plugins = [...formData.plugins, key];
      } else {
        plugins = formData.plugins.filter((item) => item !== key);
      }
      onChangeForm(plugins, "plugins");
    };

    React.useEffect(() => {
      const findCh = list.find((item) => item.channel_id === activeId);
      if (!findCh) return;
      const {
        channel_name,
        channel_model,
        channel_context_length,
        channel_prompt,
        channel_plugins,
      } = findCh;
      let context_length = "8";
      if (!isUndefined(channel_context_length)) {
        context_length = String(channel_context_length);
      }
      setFormData({
        name: channel_name,
        model_type: channel_model.type,
        model_value: channel_model.name,
        // default is 8
        context_length,
        prompt: channel_prompt,
        plugins: channel_plugins,
      });
      getModelOptions(findCh.channel_model.type);
    }, []);

    React.useImperativeHandle(forwardedRef, () => ({
      submit() {
        const newList: ChannelListItem[] = JSON.parse(JSON.stringify(list));
        const findCh = newList.find((item) => item.channel_id === activeId);
        if (!findCh) return;
        findCh.channel_name = formData.name;
        findCh.channel_model.type = formData.model_type;
        findCh.channel_model.name = formData.model_value;
        findCh.channel_context_length = Number(formData.context_length);
        findCh.channel_prompt = formData.prompt;
        findCh.channel_plugins = formData.plugins;
        updateList(newList);
        updateType(formData.model_type);
        updateName(formData.model_value);
        onClose();
      },
    }));

    return (
      <div className="max-h-[500px] overflow-y-auto">
        <div>
          <Select
            className="w-full"
            size="lg"
            options={LLMOptions}
            renderLabel={renderLabel}
            value={formData.model_type}
            onChange={onChangeModelType}
          />
          <div className="flex flex-col mt-4">
            <div className="text-sm text-black/90 dark:text-white/90 mb-2">
              {tPrompt("model")}
            </div>
            <Select
              className="w-full"
              options={modelOptions}
              renderLabel={renderModelLabel}
              value={formData.model_value}
              onChange={(value) => onChangeForm(value, "model_value")}
            />
          </div>
        </div>
        <Divider />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <div className="text-sm text-black/90 mb-2 dark:text-white/90">
              {tChat("title")}
            </div>
            <Input
              allowClear
              maxLength={30}
              placeholder={tCommon("please-enter") as string}
              value={formData.name}
              onChange={(value) => onChangeForm(value, "name")}
            />
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-black/90 dark:text-white/90 flex items-center gap-1 mb-2">
              <span>{tChat("context-limit")}</span>
              <Tooltip title={tChat("context-limit-tip")}>
                <Icon icon="question_line" size={18} />
              </Tooltip>
            </div>
            <Select
              options={lengthOptions}
              value={formData.context_length}
              onChange={(value) => onChangeForm(value, "context_length")}
            />
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-black/90 dark:text-white/90 flex items-center gap-1 mb-2">
              {tPrompt("system-prompt")}
            </div>
            <Textarea
              className="h-28"
              allowClear
              placeholder={tPrompt("system-role-placeholder")}
              value={formData.prompt}
              onChange={(value) => onChangeForm(value, "prompt")}
            />
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-black/90 dark:text-white/90 flex items-center gap-1 mb-2">
              <span>{tPlugin("config")}</span>
              <span>
                ({formData.plugins.length}/{count})
              </span>
            </div>
            <div className="rounded-md p-2 bg-lx-color-fill-2 dark:bg-lx-color-fill-2-dark flex flex-col gap-1.5">
              {count ? (
                <>
                  {google_search.enable && (
                    <div
                      className={cn(
                        "bg-white dark:bg-zinc-800 rounded-md py-2 px-3 flex items-center justify-between",
                        "border dark:border-zinc-600"
                      )}
                    >
                      <div className="flex gap-1.5 items-center">
                        <Icon icon="google_line" size={18} />
                        <span className="text-[13px] font-medium">
                          {tPlugin("google-search")}
                        </span>
                      </div>
                      <Switch
                        className="h-4 w-8"
                        thumbClassName="w-3 h-3 translate-x-0.5 data-[state=checked]:translate-x-[18px]"
                        checked={formData.plugins.includes("google_search")}
                        onChange={(value) => onToggle(value, "google_search")}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs">{tPlugin("activate")}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ChatSettingForm.displayName = "ChatSettingForm";

export default ChatSettingForm;
