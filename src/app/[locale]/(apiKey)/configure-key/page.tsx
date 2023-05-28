"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib";
import { useLLM } from "@/hooks";
import Select from "@/components/ui/Select";
import OpenAI from "@/components/apiKeySetting/openai";
import Azure from "@/components/apiKeySetting/azure";

const renderLabel = (item: any) => {
  return (
    <div className="flex items-center gap-2">
      {item.ico}
      {item.label}
    </div>
  );
};

const ApiKey: React.FC = () => {
  const t = useTranslations("setting");
  const { openai, azure } = useLLM();

  const LLMOptions = React.useMemo(() => [openai, azure], [openai, azure]);
  const [model, setModel] = React.useState<string>("");

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
        <div className="flex justify-center mb-2 text-lg font-semibold">
          {t("llm-configuration")}
        </div>
        <div className="mb-6">
          <Select
            className="w-full"
            size="large"
            options={LLMOptions}
            value={model}
            renderLabel={renderLabel}
            onChange={setModel}
          />
        </div>
        {model === LLMOptions[0].value && <OpenAI />}
        {model === LLMOptions[1].value && <Azure />}
      </div>
    </div>
  );
};

export default ApiKey;
