import React from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Modal, Textarea } from "@ltopx/lx-ui";
import type { ChatItem } from "@/hooks/useChannel/types";
import { useChannelStore } from "@/hooks/useChannel";

interface ChatEditProps {
  onReSummarize: () => void;
}

const ChatEdit = React.forwardRef<any, ChatEditProps>(
  ({ onReSummarize }, forwardedRef) => {
    const tChat = useTranslations("chat");
    const tGlobal = useTranslations("global");

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");

    const copyContentRef = React.useRef("");
    const contentIdRef = React.useRef("");
    const isSummarizedRef = React.useRef(false);

    const updateContent = useChannelStore((state) => state.updateContent);

    const onClose = () => setOpen(false);

    const onOk = () => {
      if (!value?.trim()) {
        return toast.error(tGlobal("please-enter"), { id: "can-not-empty" });
      }

      // 如果是已经被总结过的内容发生了变化，就需要重新总结
      // If there are changes to the content that has already been summarized,
      // it needs to be summarized again.
      if (isSummarizedRef && value !== copyContentRef.current) {
        onReSummarize();
      }

      updateContent(contentIdRef.current, value);
      setOpen(false);
    };

    React.useImperativeHandle(forwardedRef, () => ({
      init(item: ChatItem) {
        setOpen(true);
        setValue(item.content);
        copyContentRef.current = item.content;
        contentIdRef.current = item.id;
        isSummarizedRef.current = !!item.is_summarized;
      },
    }));

    return (
      <Modal
        width={700}
        title={tChat("edit-content")}
        maskClosable={false}
        open={open}
        okText={tGlobal("ok-spacing")}
        cancelText={tGlobal("cancel-spacing")}
        onClose={onClose}
        onOk={onOk}
      >
        <Textarea
          className="h-72"
          allowClear
          placeholder={tGlobal("please-enter")}
          value={value}
          onChange={setValue}
        />
      </Modal>
    );
  }
);

ChatEdit.displayName = "ChatEdit";

export default ChatEdit;
