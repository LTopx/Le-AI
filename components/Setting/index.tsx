import * as React from "react";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import { useDebounceFn } from "ahooks";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { Modal, Input, Select, Slider, Tooltip } from "@/components";
import { useProxy, useOpenAI, modelOptions } from "@/hooks";
import type { StateOpenAI } from "@/hooks";
import { useSettingOpen } from "@/state";

const Setting: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [openAI, setOpenAI] = useOpenAI();
  const [proxyUrl, setProxyUrl] = useProxy();
  const open = useSettingOpen((state) => state.open);
  const setOpen = useSettingOpen((state) => state.update);

  const { t } = useTranslation("setting");
  const { t: tCommon } = useTranslation("common");

  const { run: onChangeTemperature } = useDebounceFn(
    (value: number) => onChangeOpenAI(value, "temperature"),
    { wait: 500 }
  );

  const themeOptions = [
    {
      label: tCommon("light-mode"),
      value: "light",
    },
    {
      label: tCommon("dark-mode"),
      value: "dark",
    },
    {
      label: tCommon("system-theme"),
      value: "system",
    },
  ];

  const onClose = () => setOpen(false);

  const onChangeOpenAI = (value: any, key: keyof StateOpenAI) => {
    setOpenAI((openai) => {
      if (key === "openAIKey") {
        openai[key] = value;
      } else if (key === "azureOpenAIKey") {
        openai[key] = value;
      } else if (key === "temperature") {
        openai[key] = value;
      } else if (key === "max_tokens") {
        openai[key] = value;
      } else if (key === "model") {
        openai[key] = value;
      }
      return openai;
    });
  };

  const onChangeProxy = (value: any, key: "openai" | "azure") => {
    setProxyUrl((proxy) => {
      if (key === "openai") {
        proxy.openaiProxyUrl = value;
      } else if (key === "azure") {
        proxy.azureProxyUrl = value;
      }
      return proxy;
    });
  };

  return (
    <Modal
      footer={null}
      maskClosable={false}
      title={t("title")}
      open={open}
      onClose={onClose}
    >
      {/* OpenAI API KEY */}
      <div
        className={clsx(
          "border-b flex py-2 px-1 items-center justify-between",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="font-medium text-sm text-black/90 dark:text-white/90">
          OpenAI key
        </div>
        <div>
          <Input
            className="w-44"
            type="password"
            allowClear
            placeholder={t("set-openai-key") as string}
            value={openAI.openAIKey}
            onChange={(value) => onChangeOpenAI(value, "openAIKey")}
          />
        </div>
      </div>
      {/* OpenAI PROXY URL */}
      <div
        className={clsx(
          "border-b flex py-2 px-1 items-center justify-between",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="font-medium text-sm text-black/90 dark:text-white/90">
          {t("openai-proxy-url")}
        </div>
        <div>
          <Input
            className="w-44"
            allowClear
            placeholder={t("set-proxy-url") as string}
            value={proxyUrl.openai}
            onChange={(value) => onChangeProxy(value, "openai")}
          />
        </div>
      </div>
      {/* Azure OpenAI key */}
      <div
        className={clsx(
          "border-b flex py-2 px-1 items-center justify-between",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="font-medium text-sm text-black/90 dark:text-white/90">
          Azure OpenAI key
        </div>
        <div>
          <Input
            className="w-44"
            type="password"
            allowClear
            placeholder={t("set-azure-key") as string}
            value={openAI.azureOpenAIKey}
            onChange={(value) => onChangeOpenAI(value, "azureOpenAIKey")}
          />
        </div>
      </div>
      {/* Azure OpenAI PROXY URL */}
      <div
        className={clsx(
          "border-b flex py-2 px-1 items-center justify-between",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="font-medium text-sm text-black/90 dark:text-white/90">
          {t("azure-proxy-url")}
        </div>
        <div>
          <Input
            className="w-44"
            allowClear
            placeholder={t("set-proxy-url") as string}
            value={proxyUrl.azure}
            onChange={(value) => onChangeProxy(value, "azure")}
          />
        </div>
      </div>
      {/* THEME */}
      <div
        className={clsx(
          "border-b flex py-2 px-1 items-center justify-between",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="font-medium text-sm text-black/90 dark:text-white/90">
          {t("theme")}
        </div>
        <div>
          <Select
            className="w-44"
            contentClassName="w-44"
            options={themeOptions}
            placeholder="Please Select"
            value={theme}
            onChange={setTheme}
          />
        </div>
      </div>
      {/* LLM */}
      <div
        className={clsx(
          "border-b flex py-2 px-1 items-center justify-between",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="font-medium text-sm text-black/90 dark:text-white/90">
          {t("model")}
        </div>
        <div>
          <Select
            className="w-44"
            contentClassName="w-44"
            options={modelOptions}
            value={openAI.model}
            onChange={(value) => onChangeOpenAI(value, "model")}
          />
        </div>
      </div>
      {/* TEMPERATURE */}
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
          <span className="text-sm">{openAI.temperature}</span>
          <Slider
            className="w-36 md:w-44"
            max={1}
            step={0.1}
            defaultValue={openAI.temperature}
            onChange={onChangeTemperature}
          />
        </div>
      </div>
      {/* MAX TOKENS */}
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
            placeholder={t("set-proxy-url") as string}
            value={openAI.max_tokens}
            onChange={(value) => onChangeOpenAI(value, "max_tokens")}
          />
        </div>
      </div>
    </Modal>
  );
};

Setting.displayName = "Setting";

export default Setting;
