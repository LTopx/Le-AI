import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Icon from "@/components/icon";
import { Slider } from "@/components/ui/slider";
import { isUndefined } from "@/lib";
import { useOpenAIStore } from "@/hooks/useOpenAI";
import type { OpenRouter } from "@/hooks/useOpenAI/types";

export default function OpenRouter() {
  const tGlobal = useTranslations("global");
  const tConfigure = useTranslations("configure");

  const openRouter = useOpenAIStore((state) => state.openRouter);

  const updateOpenRouter = useOpenAIStore((state) => state.updateOpenRouter);

  const mapTemperature = (value: number) => {
    if (value === 0) return tConfigure("deterministic");
    if (value === 0.5) return tConfigure("neutral");
    if (value === 1) return tConfigure("random");
    return "";
  };

  const onChange = (value: string | number, key: keyof OpenRouter) => {
    updateOpenRouter({ ...openRouter, [key]: value });
  };

  const onBlur = (value: number, key: keyof OpenRouter) => {
    if (key === "max_tokens") {
      const min = 1;
      const max = 1025;
      const step = 1;
      if (max && value > max) {
        updateOpenRouter({ ...openRouter, [key]: max });
      } else if (min && value < min) {
        updateOpenRouter({ ...openRouter, [key]: min });
      } else if (!isUndefined(step) && step > 0) {
        const stepValue = Math.round(value / step) * step;
        updateOpenRouter({ ...openRouter, [key]: stepValue });
      }
    }
  };

  return (
    <div className="grid w-full items-center gap-4">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="apiKey" className="flex items-center gap-2">
          <span>API Key</span>
          <a
            href="https://openrouter.ai/keys"
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
          value={openRouter.apiKey}
          onChange={(e) => onChange(e.target.value, "apiKey")}
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
            {mapTemperature(openRouter.temperature)}
          </span>
        </Label>
        <Slider
          className="flex-1 h-[6px]"
          max={1}
          step={0.5}
          defaultValue={[openRouter.temperature]}
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
          max={1025}
          step={1}
          value={openRouter.max_tokens}
          onChange={(e) => onChange(Number(e.target.value), "max_tokens")}
          onBlur={(e) => onBlur(Number(e.target.value), "max_tokens")}
        />
      </div>
    </div>
  );
}
