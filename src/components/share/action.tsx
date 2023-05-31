import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import { useClipboard } from "l-hooks";
import {
  AiOutlineLink,
  AiOutlineTwitter,
  AiOutlineDelete,
  AiOutlineLoading,
} from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { FiUserMinus } from "react-icons/fi";
import { RxOpenInNewWindow } from "react-icons/rx";
import { cn } from "@/lib";
import Modal from "@/components/ui/Modal";
import Dropdown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import type { IDropdownItems } from "@/components/ui/Dropdown";

const Action = React.forwardRef((_, forwardedRef) => {
  const t = useTranslations("share");
  const tCommon = useTranslations("common");
  const { copy } = useClipboard();

  const shareId = React.useRef<string>("");
  const [shareLink, setShareLink] = React.useState<string>("");
  const [loadingAction, setLoadingAction] = React.useState<boolean>(false);

  const options: IDropdownItems[] = [
    {
      label: t("share-anonymously"),
      value: "anonymous",
      icon: <FiUserMinus size={16} className="text-neutral-600" />,
    },
    {
      label: t("share-to-twitter"),
      value: "twitter",
      icon: <AiOutlineTwitter size={16} className="text-[#379bf0]" />,
    },
    {
      label: t("share-remove"),
      value: "delete",
      icon: <AiOutlineDelete size={16} className="text-rose-600" />,
    },
  ];

  const [open, setOpen] = React.useState(false);

  const onClose = () => setOpen(false);

  const onLink = (type: "copy" | "open") => {
    if (type === "copy") {
      copy(shareLink);
      toast.success(t("share-link-copy-success"), { id: "copy-success" });
    } else {
      window.open(shareLink);
    }
  };

  const onSelect = async (value: string) => {
    if (value === "delete") {
      try {
        setLoadingAction(true);
        const res = await fetch("/api/share/delete", {
          method: "POST",
          body: JSON.stringify({ id: shareId.current }),
        }).then((res) => res.json());
        if (res.error) {
          return toast.error(tCommon("service-error"), { id: "delete-error" });
        }
        toast.success(t("share-remove-success"), { id: "delete-success" });
        onClose();
      } finally {
        setLoadingAction(false);
      }
    } else if (value === "twitter") {
      window.open(`https://twitter.com/share?url=${shareLink}`);
    } else if (value === "anonymous") {
      setLoadingAction(true);
      const res = await fetch("/api/share", {
        method: "PUT",
        body: JSON.stringify({ id: shareId.current, anonymous: 1 }),
      }).then((res) => res.json());
      setLoadingAction(false);
      if (res.error) {
        return toast.error(tCommon("service-error"), { id: "update-error" });
      }
      toast.success(t("share-update-success"), { id: "update-success" });
    }
  };

  React.useImperativeHandle(forwardedRef, () => ({
    init(id: string) {
      shareId.current = id;
      const baseURL =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://gpt.ltopx.com";
      setShareLink(`${baseURL}/share/${id}`);
      setOpen(true);
    },
  }));

  return (
    <Modal
      title={t("share-link")}
      maskClosable={false}
      open={open}
      onClose={onClose}
      footer={null}
    >
      <div className="mb-4 text-sm text-neutral-600 dark:text-white/80 flex flex-col gap-2">
        <div>🎉🎉 {t("share-created")}</div>
        <div>{t("share-logged-user-tip")}</div>
        <div>❌❌ {t("share-delete-tip")}</div>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            type="success"
            leftIcon={<AiOutlineLink />}
            onClick={() => onLink("copy")}
          >
            {t("copy-link")}
          </Button>
          <Button
            type="primary"
            leftIcon={<RxOpenInNewWindow />}
            onClick={() => onLink("open")}
          >
            {t("open")}
          </Button>
        </div>
        {loadingAction ? (
          <button
            className={cn(
              "px-3 rounded-md border transition-colors",
              "hover:bg-neutral-100"
            )}
          >
            <AiOutlineLoading className="animate-spin" />
          </button>
        ) : (
          <Dropdown
            options={options}
            onSelect={onSelect}
            trigger={
              <button
                className={cn(
                  "px-3 rounded-md border transition-colors",
                  "hover:bg-neutral-100"
                )}
              >
                <BsThreeDots />
              </button>
            }
          />
        )}
      </div>
    </Modal>
  );
});

Action.displayName = "Action";

export default Action;
