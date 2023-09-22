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
import { isUndefined } from "@/lib";
import Icon from "@/components/icon";
import { Slider } from "@/components/ui/slider";
import { useOpenAIStore } from "@/hooks/useOpenAI";
import type { OpenAI } from "@/hooks/useOpenAI/types";

export default function OpenAI() {
  const tGlobal = useTranslations("global");
  const tConfigure = useTranslations("configure");

  const openai = useOpenAIStore((state) => state.openai);

  const updateOpenAI = useOpenAIStore((state) => state.updateOpenAI);

  const mapTemperature = (value: number) => {
    if (value === 0) return tConfigure("deterministic");
    if (value === 0.5) return tConfigure("neutral");
    if (value === 1) return tConfigure("random");
    return "";
  };

  const onChange = (value: string | number, key: keyof OpenAI) => {
    updateOpenAI({ ...openai, [key]: value });
  };

  const onBlur = (value: number, key: keyof OpenAI) => {
    if (key === "max_tokens") {
      const min = 1;
      const max = 4097;
      const step = 1;
      if (max && value > max) {
        updateOpenAI({ ...openai, [key]: max });
      } else if (min && value < min) {
        updateOpenAI({ ...openai, [key]: min });
      } else if (!isUndefined(step) && step > 0) {
        const stepValue = Math.round(value / step) * step;
        updateOpenAI({ ...openai, [key]: stepValue });
      }
    }
  };

  return (
    <div className="grid w-full items-center gap-4">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="apiKey" className="flex items-center gap-2">
          <span>API Key</span>
          <a
            href="https://platform.openai.com/account/api-keys"
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
          value={openai.apiKey}
          onChange={(e) => onChange(e.target.value, "apiKey")}
        />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="proxy">{tConfigure("api-proxy")}</Label>
        <Input
          id="proxy"
          placeholder="https://api.openai.com/v1"
          value={openai.proxy}
          onChange={(e) => onChange(e.target.value, "proxy")}
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
            {mapTemperature(openai.temperature)}
          </span>
        </Label>
        <Slider
          className="flex-1 h-[6px]"
          max={1}
          step={0.5}
          defaultValue={[openai.temperature]}
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
          value={openai.max_tokens}
          onChange={(e) => onChange(Number(e.target.value), "max_tokens")}
          onBlur={(e) => onBlur(Number(e.target.value), "max_tokens")}
        />
      </div>
    </div>
  );
}
