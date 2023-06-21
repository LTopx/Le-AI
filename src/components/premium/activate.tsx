"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { AiOutlineCheck } from "react-icons/ai";
import { BsArrowReturnRight } from "react-icons/bs";
import { Modal, Input, Button } from "@/components/ui";
import { useSetting, usePremium, useUserInfo, useRecharge } from "@/hooks";

const Activate = React.forwardRef((_, forwardedRef) => {
  const t = useTranslations("premium");
  const [, setSettingOpen] = useSetting();
  const [, setPremiumOpen] = usePremium();
  const [, setUserInfo] = useUserInfo();
  const [, setRechargeOpen] = useRecharge();

  const [open, setOpen] = React.useState(false);
  const [licenseKey, setLicenseKey] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onClose = () => setOpen(false);

  const onCheckPremium = () => {
    setOpen(false);
    setSettingOpen(false);
    setPremiumOpen(true);
  };

  const onCheckRecharge = () => {
    setOpen(false);
    setSettingOpen(false);
    setRechargeOpen(true);
  };

  const onActivate = () => {
    if (!licenseKey?.trim()?.length) {
      return toast.error(t("enter-license-key"), { id: "enter-license-key" });
    }

    const params = {
      license_key: licenseKey,
      instance_name: "L-GPT",
    };

    setLoading(true);
    fetch("/api/licenses/activate", {
      method: "POST",
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return toast.error(res.msg, { id: "license-key-error" });
        }

        let toastInfo = "";

        if (res.data.type === "tokens") {
          toastInfo = t("tokens-recharged");
        } else if (res.data.type === "license") {
          toastInfo = t("license-key-activated");
        } else if (res.data.type === "activity") {
          toastInfo = t("gift-code-used-success");
        }

        toast.success(toastInfo, { id: "activated", duration: 5000 });

        setUserInfo(0);
        setOpen(false);
        setSettingOpen(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useImperativeHandle(forwardedRef, () => ({
    init() {
      setLicenseKey("");
      setOpen(true);
    },
  }));

  return (
    <Modal
      title={t("activate-license")}
      footer={null}
      maskClosable={false}
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <div className="text-sm">{t("enter-license-key-to-lock-features")}</div>
        <Input
          size="large"
          placeholder={t("enter-license-key")}
          allowClear
          value={licenseKey}
          onChange={setLicenseKey}
        />
        <div className="text-sm mt-2 flex gap-4">
          <span>{t("not-have-one")}</span>
          <span
            onClick={onCheckPremium}
            className="text-sky-400 cursor-pointer transition-colors hover:underline hover:text-sky-500 flex items-center gap-1"
          >
            <BsArrowReturnRight />
            {t("buy-for-you")}
          </span>
        </div>
        <div className="text-sm mb-2 flex gap-4">
          <span>{t("get-more-token")}</span>
          <span
            onClick={onCheckRecharge}
            className="text-sky-400 cursor-pointer transition-colors hover:underline hover:text-sky-500 flex items-center gap-1"
          >
            <BsArrowReturnRight />
            {t("buy-for-you")}
          </span>
        </div>
        <div className="flex justify-center">
          <Button
            type="primary"
            className="h-9 w-36"
            leftIcon={<AiOutlineCheck />}
            loading={loading}
            onClick={onActivate}
          >
            {t("activate")}
          </Button>
        </div>
      </div>
    </Modal>
  );
});

Activate.displayName = "Activate";

export default Activate;
