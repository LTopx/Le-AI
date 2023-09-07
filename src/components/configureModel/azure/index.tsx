import React from "react";
import { useTranslations } from "next-intl";
import { Input, Tooltip, Divider, Button } from "@ltopx/lx-ui";
import { Slider } from "@/components/ui/slider";
import { useOpenAIStore } from "@/hooks/useOpenAI";
import { useLLMStore } from "@/hooks/useLLM";
import type { Model } from "@/hooks/useLLM/types";
import type { Azure } from "@/hooks/useOpenAI/types";
import Icon from "@/components/icon";
import { cn } from "@/lib";
import Handler from "./handler";

export default function Azure() {
  const tGlobal = useTranslations("global");
  const tConfigure = useTranslations("configure");

  const azure = useOpenAIStore((state) => state.azure);
  const azureModels = useLLMStore((state) => state.azure.models);

  const handlerRef = React.useRef<any>(null);

  const updateAzure = useOpenAIStore((state) => state.updateAzure);

  const mapTemperature = (value: number) => {
    if (value === 0) return tConfigure("deterministic");
    if (value === 0.5) return tConfigure("neutral");
    if (value === 1) return tConfigure("random");
    return "";
  };

  const onChange = (value: string | number, key: keyof Azure) => {
    updateAzure({ ...azure, [key]: value });
  };

  const onEdit = (item: Model) => handlerRef.current?.init(item);

  return (
    <>
      <div className="flex flex-col gap-3">
        <div>
          <div className="mb-1 text-sm flex gap-4 items-end">
            <span>API Key</span>
            <a
              href="https://portal.azure.com"
              target="_blank"
              className="text-xs text-sky-400 cursor-pointer transition-colors hover:underline hover:text-sky-500"
            >
              ({tConfigure("get-apiKey")})
            </a>
          </div>
          <div className="flex gap-2 w-full">
            <Input
              className="w-full"
              type="password"
              allowClear
              placeholder={tGlobal("please-enter")}
              value={azure.apiKey}
              onChange={(value) => onChange(value, "apiKey")}
            />
          </div>
        </div>
        <div>
          <div className="mb-1 text-sm">{tConfigure("resource-name")}</div>
          <Input
            allowClear
            placeholder={tGlobal("please-enter")}
            value={azure.resourceName}
            onChange={(value) => onChange(value, "resourceName")}
          />
        </div>
        <div>
          <div className="mb-1 text-sm flex items-center gap-2">
            {tConfigure("temperature")}
            <Tooltip title={tConfigure("temperature-tip")}>
              <Icon icon="question_line" size={18} />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Slider
              className="flex-1"
              max={1}
              step={0.5}
              defaultValue={[azure.temperature]}
              onValueChange={(value) => onChange(value[0], "temperature")}
            />
            <div
              className={cn(
                "text-sm hidden md:flex w-28 h-8 justify-center items-center rounded-md",
                "bg-neutral-200 dark:bg-neutral-700/90"
              )}
            >
              {mapTemperature(azure.temperature)}
            </div>
          </div>
        </div>
        <div>
          <div className="mb-1 text-sm flex items-center gap-2">
            {tConfigure("max-tokens")}
            <Tooltip title={tConfigure("max-tokens-tip")}>
              <Icon icon="question_line" size={18} />
            </Tooltip>
          </div>
          <Input
            type="number"
            min={1}
            max={4097}
            step={1}
            placeholder={tGlobal("please-enter")}
            value={azure.max_tokens}
            onChange={(value) => onChange(value, "max_tokens")}
          />
        </div>
        <Divider />
        <div>
          <div className="mb-3 text-sm flex items-center justify-between">
            <div>{tGlobal("deployments")}</div>
          </div>
          <div className="flex flex-col gap-2">
            {azureModels.map((item) => (
              <div
                key={item.label}
                onClick={() => onEdit(item)}
                className={cn(
                  "h-9 px-4 rounded-md text-sm flex items-center justify-between gap-3 cursor-pointer transition-colors",
                  "bg-gray-200/70 hover:bg-gray-200",
                  "dark:bg-neutral-700/90 dark:hover:bg-zinc-600"
                )}
              >
                <div className="flex gap-1 max-w-[50%] whitespace-nowrap">
                  <div>{tGlobal("name")}:</div>
                  <div className="overflow-hidden text-ellipsis">
                    {item.value}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" outline className="text-xs px-2">
                    {item.label}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Handler ref={handlerRef} />
    </>
  );
}
