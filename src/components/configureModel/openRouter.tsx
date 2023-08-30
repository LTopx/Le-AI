import React from "react";
import { useTranslations } from "next-intl";
import { Input, Tooltip, Slider } from "@ltopx/lx-ui";
import Icon from "@/components/icon";
import { useOpenAIStore } from "@/hooks/useOpenAI";
import type { OpenRouter } from "@/hooks/useOpenAI/types";
import { cn } from "@/lib";

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

  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="mb-1 text-sm flex gap-4 items-end">
          <span>API Key</span>
          <a
            href="https://openrouter.ai/keys"
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
            value={openRouter.apiKey}
            onChange={(value) => onChange(value, "apiKey")}
          />
        </div>
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
            defaultValue={openRouter.temperature}
            onChange={(value) => onChange(value, "temperature")}
          />
          <div
            className={cn(
              "text-sm hidden md:flex w-28 h-8 justify-center items-center rounded-md",
              "bg-neutral-200 dark:bg-neutral-700/90"
            )}
          >
            {mapTemperature(openRouter.temperature)}
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
          allowClear
          min={1}
          max={1025}
          step={1}
          placeholder={tGlobal("please-enter")}
          value={openRouter.max_tokens}
          onChange={(value) => onChange(value, "max_tokens")}
        />
      </div>
    </div>
  );
}
