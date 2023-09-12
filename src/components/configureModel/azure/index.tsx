import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ltopx/lx-ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { isUndefined } from "@/lib";
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

  const onBlur = (value: number, key: keyof Azure) => {
    if (key === "max_tokens") {
      const min = 1;
      const max = 4097;
      const step = 1;
      if (max && value > max) {
        updateAzure({ ...azure, [key]: max });
      } else if (min && value < min) {
        updateAzure({ ...azure, [key]: min });
      } else if (!isUndefined(step) && step > 0) {
        const stepValue = Math.round(value / step) * step;
        updateAzure({ ...azure, [key]: stepValue });
      }
    }
  };

  const onEdit = (item: Model) => handlerRef.current?.init(item);

  return (
    <>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="apiKey" className="flex items-center gap-2">
            <span>API Key</span>
            <a
              href="https://portal.azure.com"
              target="_blank"
              className="text-xs text-sky-400 cursor-pointer transition-colors hover:underline hover:text-sky-500"
            >
              ({tConfigure("get-apiKey")})
            </a>
          </Label>
          <Input
            id="apiKey"
            type="password"
            placeholder={tGlobal("please-enter")}
            value={azure.apiKey}
            onChange={(e) => onChange(e.target.value, "apiKey")}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="resourceName">{tConfigure("resource-name")}</Label>
          <Input
            id="resourceName"
            placeholder={tConfigure("set-api-proxy") as string}
            value={azure.resourceName}
            onChange={(e) => onChange(e.target.value, "resourceName")}
          />
        </div>
        <div className="flex flex-col space-y-4">
          <Label className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{tConfigure("temperature")}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Icon icon="question_line" size={18} />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[calc(100vw-4rem)]">
                    {tConfigure("temperature-tip")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm text-muted-foreground">
              {mapTemperature(azure.temperature)}
            </span>
          </Label>
          <Slider
            className="flex-1 h-[6px]"
            max={1}
            step={0.5}
            defaultValue={[azure.temperature]}
            onValueChange={(value) => onChange(value[0], "temperature")}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="max_tokens" className="flex items-center gap-2">
            <span>{tConfigure("max-tokens")}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Icon icon="question_line" size={18} />
                </TooltipTrigger>
                <TooltipContent className="max-w-[calc(100vw-4rem)]">
                  {tConfigure("max-tokens-tip")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input
            id="max_tokens"
            type="number"
            min={1}
            max={4097}
            step={1}
            value={azure.max_tokens}
            onChange={(e) => onChange(Number(e.target.value), "max_tokens")}
            onBlur={(e) => onBlur(Number(e.target.value), "max_tokens")}
          />
        </div>
      </div>
      <Separator className="my-7" />
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
      <Handler ref={handlerRef} />
    </>
  );
}
