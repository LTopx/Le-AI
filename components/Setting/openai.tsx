import * as React from "react";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { Input, Slider, Tooltip } from "@/components";
import { useOpenAI } from "@/hooks";

const OpenAI: React.FC = () => {
  const { t } = useTranslation("setting");
  const [openAI, setOpenAI] = useOpenAI();

  const onChange = (value: any, key: string) => {
    setOpenAI((query) => {
      if (key === "apiKey") {
        query.openai.apiKey = value;
      } else if (key === "proxy") {
        query.openai.proxy = value;
      } else if (key === "temperature") {
        query.openai.temperature = value;
      } else if (key === "max_tokens") {
        query.openai.max_tokens = value;
      }
      return query;
    });
  };

  const mapTemperature = (value: number) => {
    if (value === 0) return t("deterministic");
    if (value === 0.5) return t("neutral");
    if (value === 1) return t("random");
    return "";
  };

  return (
    <>
      <div
        className={clsx(
          "border-b flex py-2 px-1 items-center justify-between",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="font-medium text-sm text-black/90 dark:text-white/90">
          API Key
        </div>
        <div>
          <Input
            className="w-44"
            type="password"
            allowClear
            placeholder={t("set-api-key") as string}
            value={openAI.openai.apiKey}
            onChange={(value) => onChange(value, "apiKey")}
          />
        </div>
      </div>
      <div
        className={clsx(
          "border-b flex py-2 px-1 items-center justify-between",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="font-medium text-sm text-black/90 dark:text-white/90">
          {t("api-proxy")}
        </div>
        <div>
          <Input
            className="w-44"
            allowClear
            placeholder={t("set-api-proxy") as string}
            value={openAI.openai.proxy}
            onChange={(value) => onChange(value, "proxy")}
          />
        </div>
      </div>
      <div
        className={clsx(
          "border-b flex py-2 px-1 items-center justify-between",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="font-medium flex gap-2 items-center text-sm text-black/90 dark:text-white/90">
          {t("temperature")}
          <Tooltip title={t("temperature-tip")}>
            <AiOutlineQuestionCircle size={18} />
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm hidden md:block">
            {mapTemperature(openAI.openai.temperature)}
          </span>
          <Slider
            className="w-44"
            max={1}
            step={0.5}
            defaultValue={openAI.openai.temperature}
            onChange={(value) => onChange(value, "temperature")}
          />
        </div>
      </div>
      <div
        className={clsx(
          "border-b flex py-2 px-1 items-center justify-between",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="font-medium text-sm text-black/90 dark:text-white/90">
          {t("max-tokens")}
        </div>
        <div>
          <Input
            className="w-44"
            type="number"
            min={1}
            max={4097}
            step={1}
            placeholder={t("set-temperature") as string}
            value={openAI.openai.max_tokens}
            onChange={(value) => onChange(value, "max_tokens")}
          />
        </div>
      </div>
    </>
  );
};

export default OpenAI;
