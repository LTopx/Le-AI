import * as React from "react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import { useDebounceFn } from "ahooks";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { Modal, Input, Select, Slider, Tooltip } from "@/components";
import { useProxy, useOpenAI, modelOptions } from "@/hooks";
import type { StateOpenAI } from "@/hooks";

const Setting = React.forwardRef((_, forwardedRef) => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openAI, setOpenAI] = useOpenAI();
  const [proxyUrl, setProxyUrl] = useProxy();

  const { t } = useTranslation("nav");
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

  React.useImperativeHandle(forwardedRef, () => ({
    init() {
      setOpen(true);
    },
  }));

  return (
    <Modal
      footer={null}
      maskClosable={false}
      title={t("setting")}
      open={open}
      onClose={onClose}
    >
      {/* API KEY */}
      <div
        className={classNames(
          "border-b flex py-2 px-1 items-center justify-between",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="font-medium text-sm text-black/90 dark:text-white/90">
          API key
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
      {/* PROXY URL */}
      <div
        className={classNames(
          "border-b flex py-2 px-1 items-center justify-between",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="font-medium text-sm text-black/90 dark:text-white/90">
          {t("proxy-url")}
        </div>
        <div>
          <Input
            className="w-44"
            allowClear
            placeholder={t("set-proxy-url") as string}
            value={proxyUrl}
            onChange={setProxyUrl}
          />
        </div>
      </div>
      {/* THEME */}
      <div
        className={classNames(
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
        className={classNames(
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
        className={classNames(
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
        className={classNames(
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
});

Setting.displayName = "Setting";

export default Setting;
