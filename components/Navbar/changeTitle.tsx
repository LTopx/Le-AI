import * as React from "react";
import { useTranslation } from "next-i18next";
import { Input, Modal } from "@/components";
import { useChannel } from "@/hooks";

const ChangeTitle = React.forwardRef((_, forwardedRef) => {
  const { t } = useTranslation("nav");
  const { t: tCommon } = useTranslation("common");

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
      <div className="flex gap-6 items-center pt-2">
        <div>{t("title")}</div>
        <Input
          className="flex-1"
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
