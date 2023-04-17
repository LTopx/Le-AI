import * as React from "react";
import { useTranslation } from "next-i18next";
import { Modal } from "@/components";
import { useOpenAIKey, useProxy } from "@/hooks";

const Setting = React.forwardRef((_, forwardedRef) => {
  const [open, setOpen] = React.useState(false);
  const [openAIKey, setOpenAIKey] = useOpenAIKey();
  const [proxyUrl, setProxyUrl] = useProxy();

  const { t } = useTranslation("nav");

  const onClose = () => setOpen(false);

  React.useImperativeHandle(forwardedRef, () => ({
    init() {
      setOpen(true);
    },
  }));

  return (
    <Modal
      maskClosable={false}
      title={t("setting")}
      width={600}
      open={open}
      onClose={onClose}
    >
      <div className="border-b flex border-slate-100 py-2 px-6 items-center justify-between">
        <div className="font-semibold text-sm">API key</div>
        <div className="text-xs">
          <input
            className="border rounded-md p-2"
            type="password"
            placeholder="Set Your OpenAI Key"
            value={openAIKey}
            onChange={(e) => setOpenAIKey(e.target.value)}
          />
        </div>
      </div>
      <div className="border-b flex border-slate-100 py-2 px-6 items-center justify-between">
        <div className="font-semibold text-sm">{t("proxy-url")}</div>
        <div className="text-xs">
          <input
            className="border rounded-md p-2"
            placeholder="Set Your OpenAI Key"
            value={proxyUrl}
            onChange={(e) => setProxyUrl(e.target.value)}
          />
        </div>
      </div>
      <div className="border-b flex border-slate-100 py-2 px-6 items-center justify-between">
        <div className="font-semibold text-sm">{t("model")}</div>
        <div className="text-xs">
          <select className="border rounded-md p-2">
            <option value="gpt-3.5">gpt-3.5</option>
          </select>
        </div>
      </div>
      <div className="border-b flex border-slate-100 py-2 px-6 items-center justify-between">
        <div className="font-semibold text-sm">{t("theme")}</div>
        <div className="text-xs">
          <select className="border rounded-md p-2">
            <option value="auto">auto</option>
          </select>
        </div>
      </div>
    </Modal>
  );
});

Setting.displayName = "Setting";

export default Setting;
