import React from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import { cn } from "@/lib";
import { useOpenAI } from "@/hooks";
import { Button, Input, Slider, Tooltip, Icon } from "@/components/ui";
import check_line from "@iconify/icons-mingcute/check-line";
import question_line from "@iconify/icons-mingcute/question-line";

type CheckStatus = "" | "success" | "error";

export default function OpenAI() {
  const t = useTranslations("setting");
  const [openAI, setOpenAI] = useOpenAI();
  const [loading, setLoading] = React.useState(false);
  const [checkStatus, setCheckStatus] = React.useState<CheckStatus>("");
  const [apiKeyInfo, setApiKeyInfo] = React.useState<any>({});

  const mapTemperature = (value: number) => {
    if (value === 0) return t("deterministic");
    if (value === 0.5) return t("neutral");
    if (value === 1) return t("random");
    return "";
  };

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

  const onCheck = () => {
    setCheckStatus("");
    setApiKeyInfo({});
    if (!openAI.openai.apiKey) {
      return toast.error(t("check-api-key-warning"), { id: "enter_key" });
    }
    setLoading(true);
    fetch(
      `/api/subscription?model=openai&key=${openAI.openai.apiKey}&proxy=${openAI.openai.proxy}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.error !== 0) {
          setCheckStatus("error");
        } else {
          setCheckStatus("success");
          setApiKeyInfo(res.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
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
            ({t("get-apiKey")})
          </a>
        </div>
        <div className="flex gap-2">
          <Input
            className="flex-1"
            type="password"
            allowClear
            placeholder={t("set-api-key") as string}
            value={openAI.openai.apiKey}
            onChange={(value) => onChange(value, "apiKey")}
          />
          <Button
            className="w-22 md:w-28"
            type="primary"
            leftIcon={<Icon icon={check_line} />}
            loading={loading}
            onClick={onCheck}
          >
            {t("check")}
          </Button>
        </div>
        {checkStatus === "success" && (
          <div className="bg-sky-200 rounded-md mt-2 py-1 px-3 text-sm text-black/80">
            <div className="mt-2">Approved usage limit</div>
            <div>${(apiKeyInfo.system_hard_limit_usd / 100).toFixed(2)}</div>
            <div className="mt-2">Current usage</div>
            <div>${apiKeyInfo.total_usage.toFixed(2)}</div>
            <div className="mt-2">Hard limit</div>
            <div>${apiKeyInfo.hard_limit_usd.toFixed(2)}</div>
            <div className="mt-2">Soft limit</div>
            <div className="mb-2">${apiKeyInfo.soft_limit_usd.toFixed(2)}</div>
          </div>
        )}
        {checkStatus === "error" && (
          <div className="bg-rose-200 text-black/80 rounded-md mt-2 py-1 px-3 text-sm">
            {t("api-key-error")}
          </div>
        )}
      </div>
      <div>
        <div className="mb-1 text-sm">{t("api-proxy")}</div>
        <Input
          allowClear
          placeholder={t("set-api-proxy") as string}
          value={openAI.openai.proxy}
          onChange={(value) => onChange(value, "proxy")}
        />
      </div>
      <div>
        <div className="mb-1 text-sm flex items-center gap-2">
          {t("temperature")}
          <Tooltip title={t("temperature-tip")}>
            <Icon icon={question_line} size={18} />
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <Slider
            className="flex-1"
            max={1}
            step={0.5}
            defaultValue={openAI.openai.temperature}
            onChange={(value) => onChange(value, "temperature")}
          />
          <div
            className={cn(
              "text-sm hidden md:flex w-28 h-8 justify-center items-center rounded-md",
              "bg-neutral-200 dark:bg-neutral-700/90"
            )}
          >
            {mapTemperature(openAI.openai.temperature)}
          </div>
        </div>
      </div>
      <div>
        <div className="mb-1 text-sm flex items-center gap-2">
          {t("max-tokens")}
          <Tooltip title={t("max-tokens-tip")}>
            <Icon icon={question_line} size={18} />
          </Tooltip>
        </div>
        <Input
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
  );
}
