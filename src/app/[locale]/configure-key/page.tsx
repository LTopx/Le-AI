"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib";
import { useLLM } from "@/hooks";
import { Select, Divider } from "@/components/ui";
import OpenAI from "@/components/apiKeySetting/openai";
import Azure from "@/components/apiKeySetting/azure";

function renderLabel(item: any) {
  return (
    <div className="flex items-center gap-2">
      {item.ico}
      {item.label}
    </div>
  );
}

export default function ApiKey() {
  const t = useTranslations("setting");
  const locale = useLocale();

  const url =
    locale === "zh-CN"
      ? "https://docs.ltopx.com/zh-CN/api-key-configure"
      : "https://docs.ltopx.com/api-key-configure";

  const { openai, azure } = useLLM();
  const LLMOptions = React.useMemo(() => [openai, azure], [openai, azure]);

  const [model, setModel] = React.useState<string>("");

  const findLLM = LLMOptions.find((item) => item.value === model);

  React.useEffect(() => {
    setModel(LLMOptions[0].value);
  }, []);

  return (
    <div className="mt-10">
      <div
        className={cn(
          "w-[32.5rem] max-w-[calc(100vw-2rem)] m-auto p-6 rounded-md",
          "border dark:border-neutral-600"
        )}
      >
        <div className="flex justify-center text-lg font-semibold">
          {t("llm-configuration")}
        </div>
        <div className="my-2 flex justify-center">
          <a
            href={url}
            target="_blank"
            className="text-sm text-sky-500 hover:text-sky-400 transition-colors mx-0.5"
          >
            {t("configuration-learn-more")}
          </a>
        </div>
        <Select
          className="w-full"
          size="large"
          options={LLMOptions}
          value={model}
          renderLabel={renderLabel}
          onChange={setModel}
        />
        <div className="py-2 relative">
          <Divider>{findLLM?.ico_big}</Divider>
        </div>
        {model === LLMOptions[0].value && <OpenAI />}
        {model === LLMOptions[1].value && <Azure />}
      </div>
    </div>
  );
}
