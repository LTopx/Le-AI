import * as React from "react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { Modal, Input, Select, Slider, Tooltip } from "@/components";
import { useProxy, useOpenAI } from "@/hooks";
import type { StateOpenAI } from "@/hooks";

const moduleOptions = [
  {
    label: "gpt-3.5",
    value: "gpt-3.5",
  },
];

const Setting = React.forwardRef((_, forwardedRef) => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openAI, setOpenAI] = useOpenAI();
  const [proxyUrl, setProxyUrl] = useProxy();

  const { t } = useTranslation("nav");
  const { t: tCommon } = useTranslation("common");

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
            options={moduleOptions}
            value="gpt-3.5"
          />
        </div>
      </div>
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
        <div>
          <Slider
            className="w-44"
            showValue
            max={1}
            step={0.1}
            value={openAI.temperature}
            onChange={(value) => onChangeOpenAI(value, "temperature")}
          />
        </div>
      </div>
    </Modal>
  );
});

Setting.displayName = "Setting";

export default Setting;
