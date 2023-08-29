import React from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import { useClipboard } from "l-hooks";
import { Modal, Button, Dropdown, type DropdownOption } from "@ltopx/lx-ui";
import { cn } from "@/lib";
import Icon from "../icon";

const Action = React.forwardRef((_, forwardedRef) => {
  const tGlobal = useTranslations("global");
  const tShare = useTranslations("share");

  const { copy } = useClipboard();

  const [open, setOpen] = React.useState(false);
  const shareId = React.useRef<string>("");
  const [shareLink, setShareLink] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  const options: DropdownOption[] = [
    {
      label: (
        <div className="flex gap-2 items-center">
          <Icon icon="user_hide_line" size={16} className="text-neutral-600" />
          {tShare("share-anonymously")}
        </div>
      ),
      value: "anonymous",
    },
    {
      label: (
        <div className="flex gap-2 items-center">
          <Icon icon="twitter_fill" size={16} className="text-[#379bf0]" />
          {tShare("share-to-x")}
        </div>
      ),
      value: "twitter",
    },
    {
      label: (
        <div className="flex gap-2 items-center">
          <Icon icon="delete_2_line" size={16} className="text-rose-600" />
          {tShare("share-remove")}
        </div>
      ),
      value: "delete",
    },
  ];

  const onClose = () => setOpen(false);

  const onLink = (type: "copy" | "open") => {
    if (type === "copy") {
      copy(shareLink);
      toast.success(tShare("share-link-copy-success"), { id: "copy-success" });
    } else {
      window.open(shareLink);
    }
  };

  const onSelect = async (value: string) => {
    if (value === "delete") {
      try {
        setLoading(true);
        const res = await fetch("/api/share", {
          method: "DELETE",
          body: JSON.stringify({ id: shareId.current }),
        }).then((res) => res.json());
        if (res.error) {
          return toast.error(tGlobal("service-error"), { id: "delete-error" });
        }
        toast.success(tShare("share-remove-success"), { id: "delete-success" });
        onClose();
      } finally {
        setLoading(false);
      }
    } else if (value === "twitter") {
      window.open(`https://twitter.com/share?url=${shareLink}`);
    } else if (value === "anonymous") {
      setLoading(true);
      const res = await fetch("/api/share", {
        method: "PUT",
        body: JSON.stringify({ id: shareId.current, anonymous: 1 }),
      }).then((res) => res.json());
      setLoading(false);
      if (res.error) {
        return toast.error(tGlobal("service-error"), { id: "update-error" });
      }
      toast.success(tShare("share-update-success"), { id: "update-success" });
    }
  };

  React.useImperativeHandle(forwardedRef, () => ({
    init(id: string) {
      shareId.current = id;
      const baseURL =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://le-ai.app";
      setShareLink(`${baseURL}/share/${id}`);
      setOpen(true);
    },
  }));

  return (
    <Modal
      title={tShare("share-link")}
      maskClosable={false}
      open={open}
      onClose={onClose}
      footer={null}
    >
      <div className="flex flex-col text-sm mb-4 text-neutral-600 gap-2 dark:text-white/80">
        <div>🎉🎉 {tShare("share-created")}</div>
        <div>{tShare("share-logged-user-tip")}</div>
        <div>❌❌ {tShare("share-delete-tip")}</div>
        <div>
          <a
            href="https://docs.le-ai.app/token"
            target="_blank"
            className="mx-0.5 text-sm transition-colors text-sky-500 hover:text-sky-400"
          >
            {tGlobal("learn-more")}
          </a>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            type="success"
            icon={<Icon icon="link_line" />}
            onClick={() => onLink("copy")}
          >
            {tShare("copy-link")}
          </Button>
          <Button
            type="primary"
            icon={<Icon icon="external_link_line" />}
            onClick={() => onLink("open")}
          >
            {tGlobal("open")}
          </Button>
        </div>
        {loading ? (
          <button
            className={cn(
              "px-3 rounded-md border transition-colors",
              "hover:bg-neutral-100"
            )}
          >
            <Icon icon="loading_line" className="animate-spin" />
          </button>
        ) : (
          <Dropdown options={options} onSelect={onSelect}>
            <button
              className={cn(
                "px-3 rounded-md border transition-colors flex items-center",
                "hover:bg-neutral-100"
              )}
            >
              <Icon icon="more_1_fill" />
            </button>
          </Dropdown>
        )}
      </div>
    </Modal>
  );
});

Action.displayName = "Action";

export default Action;
