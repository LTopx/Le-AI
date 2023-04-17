import * as React from "react";
import { useTranslation } from "next-i18next";
import { Modal, Input, Button } from "@/components";
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
    >
      <div className="flex gap-6 items-center p-5 pt-2">
        <div>{t("title")}</div>
        <Input
          className="flex-1"
          maxLength={30}
          value={name}
          onChange={setName}
        />
      </div>
      <div className="flex gap-2 px-5 pb-4 justify-end">
        <Button onClick={onClose}>{tCommon("cancel")}</Button>
        <Button type="primary" onClick={submit}>
          {tCommon("ok")}
        </Button>
      </div>
    </Modal>
  );
});

ChangeTitle.displayName = "ChangeTitle";

export default ChangeTitle;
