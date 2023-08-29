import React from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Modal, Input, Button } from "@ltopx/lx-ui";
import Icon from "@/components/icon";
import { useFetchError } from "@/hooks/useFetchError";
import { useUserInfoStore } from "@/hooks/useUserInfo";
import { useOpenStore } from "@/hooks/useOpen";

const Activate = React.forwardRef((_, forwardedRef) => {
  const tGlobal = useTranslations("global");
  const tPremium = useTranslations("premium");

  const { catchError } = useFetchError();

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [open, setOpen] = React.useState(false);
  const [licenseKey, setLicenseKey] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const updateUserInfo = useUserInfoStore((state) => state.update);
  const updatePremiumOpen = useOpenStore((state) => state.updatePremiumOpen);
  const updateChargeTokenOpen = useOpenStore(
    (state) => state.updateChargeTokenOpen
  );

  const onCheckPremium = () => {
    setOpen(false);
    updatePremiumOpen(true);
  };

  const onChargeToken = () => {
    setOpen(false);
    updateChargeTokenOpen(true);
  };

  const onActivate = () => {
    if (loading) return;

    if (!licenseKey?.trim()) {
      toast.error(tGlobal("please-enter"), { id: "enter-license-key" });
      return inputRef.current?.focus();
    }

    const params = { license_key: licenseKey, instance_name: "Le-AI" };
    setLoading(true);
    fetch("/api/licenses/activate", {
      method: "POST",
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return toast.error(catchError(res), { id: "activate_error" });
        }

        let toastInfo = "";

        if (res.data.type === "tokens") {
          toastInfo = tPremium("tokens-recharged");
        } else if (res.data.type === "license") {
          toastInfo = tPremium("license-key-activated");
        } else if (res.data.type === "activity") {
          toastInfo = tPremium("gift-code-used-success");
        }

        toast.success(toastInfo, { id: "activated", duration: 5000 });
        updateUserInfo(0);
        setOpen(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onClose = () => setOpen(false);

  React.useImperativeHandle(forwardedRef, () => ({
    init() {
      setOpen(true);
      setLicenseKey("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    },
  }));

  return (
    <Modal
      title={tPremium("activate-license")}
      footer={null}
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <div className="text-sm">
          {tPremium("enter-license-key-to-lock-features")}
        </div>
        <Input
          ref={inputRef}
          size="lg"
          placeholder={tGlobal("please-enter")}
          allowClear
          value={licenseKey}
          onChange={setLicenseKey}
          onEnter={onActivate}
        />
        <div className="text-sm mt-2 flex gap-4">
          <span>{tPremium("not-have-one")}</span>
          <span
            onClick={onCheckPremium}
            className="text-sky-400 cursor-pointer transition-colors hover:underline hover:text-sky-500 flex items-center gap-1"
          >
            <Icon icon="arrow_right_down_fill" />
            {tPremium("buy-for-you")}
          </span>
        </div>
        <div className="text-sm mb-2 flex gap-4">
          <span>{tPremium("get-more-points")}</span>
          <span
            onClick={onChargeToken}
            className="text-sky-400 cursor-pointer transition-colors hover:underline hover:text-sky-500 flex items-center gap-1"
          >
            <Icon icon="arrow_right_down_fill" />
            {tPremium("buy-for-you")}
          </span>
        </div>
        <div className="flex justify-center">
          <Button
            type="primary"
            size="lg"
            className="w-36"
            icon={<Icon icon="check_line" />}
            loading={loading}
            onClick={onActivate}
          >
            {tPremium("activate")}
          </Button>
        </div>
      </div>
    </Modal>
  );
});

Activate.displayName = "Activate";

export default Activate;
