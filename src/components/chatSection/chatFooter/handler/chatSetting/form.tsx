import React from "react";
import { useTranslations } from "next-intl";
import { useLLMStore } from "@/hooks/useLLM";
import { useChannelStore } from "@/hooks/useChannel";
import type { ChannelListItem } from "@/hooks/useChannel/types";
import { useModelCacheStore } from "@/hooks/useModelCache";
import { usePluginStore } from "@/hooks/usePlugin";
import { isUndefined, cn } from "@/lib";
import Icon from "@/components/icon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatSettingFormProps {
  onClose: () => void;
}

interface IConversationSettings {
  name: string;
  model_type: string;
  model_value: string;
  context_length: string;
  summarize_threshold: string;
  prompt: string;
  plugins: string[];
}

const lengthOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e) => ({
  label: String(e),
  value: String(e),
}));

const ChatSettingForm = React.forwardRef<any, ChatSettingFormProps>(
  ({ onClose }, forwardedRef) => {
    const tGlobal = useTranslations("global");
    const tChat = useTranslations("chat");
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
    const updateType = useModelCacheStore((state) => state.updateType);
    const updateName = useModelCacheStore((state) => state.updateName);

    const [modelOptions, setModelOptions] = React.useState<any[]>([]);

    const [formData, setFormData] = React.useState<IConversationSettings>({
      name: "",
      model_type: "",
      model_value: "",
      context_length: "8",
      summarize_threshold: "1000",
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

    const onBlur = (value: string) => {
      const min = 1;
      setFormData((data: IConversationSettings) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData.summarize_threshold = Number(value) < min ? String(min) : value;
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
        channel_summarize_threshold,
      } = findCh;
      let context_length = "8";
      let summarize_threshold = "1000";
      if (!isUndefined(channel_context_length)) {
        context_length = String(channel_context_length);
      }
      if (!isUndefined(channel_summarize_threshold)) {
        summarize_threshold = String(channel_summarize_threshold);
      }

      setFormData({
        name: channel_name,
        model_type: channel_model.type,
        model_value: channel_model.name,
        // default is 8
        context_length,
        // default is 1000
        summarize_threshold,
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
        findCh.channel_summarize_threshold = Number(
          formData.summarize_threshold
        );
        findCh.channel_prompt = formData.prompt;
        findCh.channel_plugins = formData.plugins;
        updateList(newList);
        updateType(formData.model_type);
        updateName(formData.model_value);
        onClose();
      },
    }));

    return (
      <div className="grid py-4 gap-4">
        <div className="flex flex-col space-y-1.5">
          <Select value={formData.model_type} onValueChange={onChangeModelType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              {LLMOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <div className="flex gap-2 items-center">
                    {item.ico}
                    {item.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="model">{tGlobal("model")}</Label>
          <Select
            value={formData.model_value}
            onValueChange={(value) => onChangeForm(value, "model_value")}
          >
            <SelectTrigger id="model">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              {modelOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
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
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Separator className="my-2.5" />
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="title">{tGlobal("title")}</Label>
          <Input
            id="title"
            maxLength={30}
            placeholder={tGlobal("please-enter")}
            value={formData.name}
            onChange={(e) => onChangeForm(e.target.value, "name")}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="context-limit" className="flex items-center gap-2">
            {tChat("context-limit")}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Icon icon="question_line" size={18} />
                </TooltipTrigger>
                <TooltipContent className="max-w-[calc(100vw-4rem)]">
                  {tChat("context-limit-tip")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Select
            value={formData.context_length}
            onValueChange={(value) => onChangeForm(value, "context_length")}
          >
            <SelectTrigger id="context-limit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              {lengthOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label
            htmlFor="summarize_threshold"
            className="flex items-center gap-2"
          >
            {tChat("threshold")}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Icon icon="question_line" size={18} />
                </TooltipTrigger>
                <TooltipContent className="max-w-[calc(100vw-4rem)]">
                  {tChat("threshold-tip")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input
            id="summarize_threshold"
            type="number"
            placeholder={tGlobal("please-enter")}
            value={formData.summarize_threshold}
            onChange={(e) =>
              onChangeForm(e.target.value, "summarize_threshold")
            }
            onBlur={(e) => onBlur(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="system-prompt">{tGlobal("system-prompt")}</Label>
          <Textarea
            id="system-prompt"
            placeholder={tGlobal("please-enter")}
            value={formData.prompt}
            onChange={(e) => onChangeForm(e.target.value, "prompt")}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="system-prompt">
            {tPlugin("config")} ({formData.plugins.length}/{count})
          </Label>
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
                      id="airplane-mode"
                      checked={formData.plugins.includes("google_search")}
                      onCheckedChange={(value) =>
                        onToggle(value, "google_search")
                      }
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs">{tPlugin("enable-first")}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ChatSettingForm.displayName = "ChatSettingForm";

export default ChatSettingForm;
