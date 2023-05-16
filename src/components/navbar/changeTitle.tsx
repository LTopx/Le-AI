import * as React from "react";
import { useTranslations } from "next-intl";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useChannel } from "@/hooks";

const ChangeTitle = React.forwardRef((_, forwardedRef) => {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");

  const [channel, setChannel] = useChannel();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState<string>("");

  const onClose = () => setOpen(false);

  const submit = () => {
    setChannel((channel) => {
      const { activeId, list } = channel;
      const findChannel = list.find((item) => item.channel_id === activeId);
      if (!findChannel) return channel;
      findChannel.channel_name = name;
      return channel;
    });
    onClose();
  };

  React.useImperativeHandle(forwardedRef, () => ({
    init() {
      const { activeId, list } = channel;
      const findChannel = list.find((item) => item.channel_id === activeId);
      if (!findChannel) return;
      setName(findChannel.channel_name);
      setOpen(true);
    },
  }));

  return (
    <Modal
      title={t("rename-conversation")}
      maskClosable={false}
      open={open}
      onClose={onClose}
      onOk={submit}
    >
      <div className="flex gap-5 items-center pt-2">
        <Input
          className="flex-1"
          allowClear
          maxLength={30}
          placeholder={tCommon("please-enter") as string}
          value={name}
          onChange={setName}
        />
      </div>
    </Modal>
  );
});

ChangeTitle.displayName = "ChangeTitle";

export default ChangeTitle;
