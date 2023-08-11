import React from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Modal, Textarea } from "@ltopx/lx-ui";
import type { ChatItem } from "@/hooks/useChannel/types";
import { useChannelStore } from "@/hooks/useChannel";

const ChatEdit = React.forwardRef((_, forwardedRef) => {
  const tCommon = useTranslations("common");
  const tChat = useTranslations("chat");

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const contentIdRef = React.useRef("");

  const updateContent = useChannelStore((state) => state.updateContent);

  const onClose = () => setOpen(false);

  const onOk = () => {
    if (!value?.trim()) {
      return toast.error(tChat("can-not-empty"), { id: "can-not-empty" });
    }

    updateContent(contentIdRef.current, value);
    setOpen(false);
  };

  React.useImperativeHandle(forwardedRef, () => ({
    init(item: ChatItem) {
      setOpen(true);
      setValue(item.content);
      contentIdRef.current = item.id;
    },
  }));

  return (
    <Modal
      width={700}
      title={tChat("edit-content")}
      maskClosable={false}
      open={open}
      okText={tCommon("ok")}
      cancelText={tCommon("cancel")}
      onClose={onClose}
      onOk={onOk}
    >
      <Textarea
        className="h-72"
        allowClear
        placeholder={tCommon("please-enter")}
        value={value}
        onChange={setValue}
      />
    </Modal>
  );
});

ChatEdit.displayName = "ChatEdit";

export default ChatEdit;
