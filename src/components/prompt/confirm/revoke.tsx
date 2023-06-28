import React from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Prompt } from "@prisma/client";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface RevokeProps {
  onReload: () => void;
}

const Revoke = React.forwardRef<any, RevokeProps>(
  ({ onReload }, forwardedRef) => {
    const t = useTranslations("prompt");
    const tCommon = useTranslations("common");

    const [open, setOpen] = React.useState(false);
    const [info, setInfo] = React.useState<Prompt>();
    const [loading, setLoading] = React.useState(false);

    const onClose = () => setOpen(false);

    const onOk = () => {
      setLoading(true);
      fetch("/api/prompt/delete", {
        method: "POST",
        body: JSON.stringify({ id: info?.id }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) return toast.error(res.msg);
          toast.success(t("revoke-success"));
          onReload();
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
        title={t("revoke")}
        maskClosable={false}
        open={open}
        onClose={onClose}
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>{tCommon("cancel")}</Button>
            <Button type="danger" loading={loading} onClick={onOk}>
              {tCommon("ok")}
            </Button>
          </div>
        }
      >
        {t("revoke-release")}
      </Modal>
    );
  }
);

Revoke.displayName = "Revoke";

export default Revoke;
