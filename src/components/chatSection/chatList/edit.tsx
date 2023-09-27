import React from "react";
import { useTranslations } from "next-intl";
import { Button, Tooltip } from "@ltopx/lx-ui";
import toast from "react-hot-toast";
import Icon from "@/components/icon";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button as SDButton } from "@/components/ui/button";
import { useChannelStore } from "@/hooks/useChannel";
import type { ChatItem } from "@/hooks/useChannel/types";

export default function Edit({
  item,
  onReSummarize,
}: {
  item: ChatItem;
  onReSummarize: () => void;
}) {
  const tGlobal = useTranslations("global");
  const tChat = useTranslations("chat");

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const copyContentRef = React.useRef("");
  const contentIdRef = React.useRef("");
  const isSummarizedRef = React.useRef(false);

  const updateContent = useChannelStore((state) => state.updateContent);

  const onClose = () => setOpen(false);

  const onEdit = () => {
    setValue(item.content);
    copyContentRef.current = item.content;
    contentIdRef.current = item.id;
    isSummarizedRef.current = !!item.is_summarized;
  };

  const onOk = () => {
    if (!value?.trim()) {
      return toast.error(tGlobal("please-enter"), { id: "can-not-empty" });
    }

    // 如果是已经被总结过的内容发生了变化，就需要重新总结
    // If there are changes to the content that has already been summarized,
    // it needs to be summarized again.
    if (isSummarizedRef.current && value !== copyContentRef.current) {
      onReSummarize();
    }

    updateContent(contentIdRef.current, value);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <Tooltip title={tChat("edit-content")}>
            <Button
              className="h-6 px-2"
              type="primary"
              outline
              size="sm"
              rounded
              onClick={onEdit}
            >
              <Icon icon="pencil_line" size={16} />
            </Button>
          </Tooltip>
        </div>
      </DialogTrigger>
      <DialogContent
        className="!w-[700px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{tChat("edit-content")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            className="h-72"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <DialogFooter>
          <div className="w-full flex justify-between">
            <SDButton variant="outline" onClick={onClose}>
              {tGlobal("cancel-spacing")}
            </SDButton>
            <SDButton onClick={onOk}>{tGlobal("ok-spacing")}</SDButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
