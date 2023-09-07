import React from "react";
import { useTranslations } from "next-intl";
import { Input, Tooltip } from "@ltopx/lx-ui";
import Icon from "@/components/icon";
import { Slider } from "@/components/ui/slider";
import { useOpenAIStore } from "@/hooks/useOpenAI";
import type { OpenAI } from "@/hooks/useOpenAI/types";
import { cn } from "@/lib";

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

  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="mb-1 text-sm flex gap-4 items-end">
          <span>API Key</span>
          <a
            href="https://platform.openai.com/account/api-keys"
            target="_blank"
            className="text-xs text-sky-400 cursor-pointer transition-colors hover:underline hover:text-sky-500"
          >
            ({tConfigure("get-apiKey")})
          </a>
        </div>
        <div className="flex gap-2">
          <Input
            className="flex-1"
            type="password"
            allowClear
            placeholder={tGlobal("please-enter")}
            value={openai.apiKey}
            onChange={(value) => onChange(value, "apiKey")}
          />
        </div>
      </div>
      <div>
        <div className="mb-1 text-sm">{tConfigure("api-proxy")}</div>
        <Input
          allowClear
          placeholder={tConfigure("set-api-proxy") as string}
          value={openai.proxy}
          onChange={(value) => onChange(value, "proxy")}
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
            defaultValue={[openai.temperature]}
            onValueChange={(value) => onChange(value[0], "temperature")}
          />
          <div
            className={cn(
              "text-sm hidden md:flex w-28 h-8 justify-center items-center rounded-md",
              "bg-neutral-200 dark:bg-neutral-700/90"
            )}
          >
            {mapTemperature(openai.temperature)}
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
          max={4097}
          step={1}
          placeholder={tGlobal("please-enter")}
          value={openai.max_tokens}
          onChange={(value) => onChange(value, "max_tokens")}
        />
      </div>
    </div>
  );
}
