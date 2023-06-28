import React from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Prompt } from "@prisma/client";

const Release = React.forwardRef((_, forwardedRef) => {
  const t = useTranslations("prompt");
  const tCommon = useTranslations("common");

  const [open, setOpen] = React.useState(false);
  const [info, setInfo] = React.useState<Prompt>();
  const [loading, setLoading] = React.useState(false);

  const onClose = () => setOpen(false);

  const onOk = () => {
    if (!info) return;

    const params = {
      title: info.title,
      icon: info.icon,
      desc: info.desc,
      content: {
        cn: (info.content as any)?.cn || "",
        en: (info.content as any)?.en || "",
      },
    };
    setLoading(true);
    fetch("/api/prompt", {
      method: "POST",
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return toast.error(res.msg || tCommon("service-error"), {
            id: "release-error",
          });
        }
        toast.success(t("release-success"), { id: "release-success" });
        setOpen(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useImperativeHandle(forwardedRef, () => ({
    init(data: Prompt) {
      setInfo(data);
      setOpen(true);
    },
  }));

  return (
    <Modal
      title={t("release-prompt")}
      maskClosable={false}
      open={open}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>{tCommon("cancel")}</Button>
          <Button type="primary" loading={loading} onClick={onOk}>
            {tCommon("ok")}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        <div className="font-semibold text-rose-400">{t("rule-title")}</div>
        <div className="text-sm text-amber-600/80">1. {t("rule-1")}</div>
        <div className="text-sm text-amber-600/80">2. {t("rule-2")}</div>
        <div className="text-sm text-amber-600/80">3. {t("rule-3")}</div>
        <div className="mt-2">{t("rule-tip")}</div>
      </div>
    </Modal>
  );
});

Release.displayName = "Release";

export default Release;
