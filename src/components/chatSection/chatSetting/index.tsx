import React from "react";
import { useTranslations } from "next-intl";
import { shallow } from "zustand/shallow";
import { Modal } from "@ltopx/lx-ui";
import { useOpenStore } from "@/hooks/useOpen";
import ChatSettingForm from "./form";

export default function ChatSetting() {
  const tChat = useTranslations("chat");
  const tCommon = useTranslations("common");

  const formRef = React.useRef<any>(null);

  const [open, setOpen] = useOpenStore(
    (state) => [state.chatSettingOpen, state.updateChatSettingOpen],
    shallow
  );

  const onClose = () => setOpen(false);

  const onSubmit = () => formRef.current?.submit();

  return (
    <Modal
      title={tChat("conversation-setting")}
      open={open}
      okText={tCommon("ok")}
      cancelText={tCommon("cancel")}
      onClose={onClose}
      onOk={onSubmit}
    >
      <ChatSettingForm ref={formRef} onClose={onClose} />
    </Modal>
  );
}
