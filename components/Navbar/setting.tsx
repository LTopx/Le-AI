import * as React from "react";
import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import { Modal, Select } from "@/components";
import { useOpenAIKey, useProxy } from "@/hooks";

const moduleOptions = [
  {
    label: "gpt-3.5",
    value: "gpt-3.5",
  },
];

const themeOptions = [
  {
    label: "light",
    value: "light",
  },
  {
    label: "dark",
    value: "dark",
  },
  {
    label: "auto",
    value: "auto",
  },
];

const Setting = React.forwardRef((_, forwardedRef) => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openAIKey, setOpenAIKey] = useOpenAIKey();
  const [proxyUrl, setProxyUrl] = useProxy();

  const { t } = useTranslation("nav");

  const onClose = () => setOpen(false);

  React.useImperativeHandle(forwardedRef, () => ({
    init() {
      setOpen(true);
      console.log(theme, "theme");
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
      <div className="border-b flex border-slate-100 py-2 px-1 items-center justify-between">
        <div className="font-semibold text-sm text-black">API key</div>
        <div className="text-xs">
          <input
            className="border rounded-md p-2 dark:bg-white"
            type="password"
            placeholder={t("set-openai-key") as string}
            value={openAIKey}
            onChange={(e) => setOpenAIKey(e.target.value)}
          />
        </div>
      </div>
      <div className="border-b flex border-slate-100 py-2 px-1 items-center justify-between">
        <div className="font-semibold text-sm text-black">{t("proxy-url")}</div>
        <div className="text-xs">
          <input
            className="border rounded-md p-2 dark:bg-white"
            placeholder={t("set-proxy-url") as string}
            value={proxyUrl}
            onChange={(e) => setProxyUrl(e.target.value)}
          />
        </div>
      </div>
      <div className="border-b flex border-slate-100 py-2 px-1 items-center justify-between">
        <div className="font-semibold text-sm text-black">{t("model")}</div>
        <div className="text-xs">
          <Select options={moduleOptions} />
        </div>
      </div>
      <div className="border-b flex border-slate-100 py-2 px-1 items-center justify-between">
        <div className="font-semibold text-sm text-black">{t("theme")}</div>
        <div className="text-xs">
          <Select
            options={themeOptions}
            placeholder="Select"
            value={theme}
            onChange={setTheme}
          />
        </div>
      </div>
    </Modal>
  );
});

Setting.displayName = "Setting";

export default Setting;
