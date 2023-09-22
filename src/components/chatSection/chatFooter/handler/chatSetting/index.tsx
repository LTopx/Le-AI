import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ltopx/lx-ui";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Icon from "@/components/icon";
import { Button as SButton } from "@/components/ui/button";
import ChatSettingForm from "./form";

export default function ChatSetting() {
  const tChat = useTranslations("chat");
  const tGlobal = useTranslations("global");

  const formRef = React.useRef<any>(null);

  const [open, setOpen] = React.useState(false);

  const onClose = () => setOpen(false);

  const onOk = () => formRef.current?.submit();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="h-7 text-xs px-2.5 group"
          rounded
          outline
          type="primary"
          icon={<Icon icon="settings_3_line" size={18} />}
        >
          <span className="hidden lg:block">
            {tChat("conversation-setting")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="!w-[520px]">
        <DialogHeader>
          <DialogTitle>{tChat("conversation-setting")}</DialogTitle>
        </DialogHeader>
        <ChatSettingForm ref={formRef} onClose={onClose} />
        <DialogFooter>
          <div className="flex justify-between flex-1">
            <SButton variant="outline" size="sm" onClick={onClose}>
              {tGlobal("cancel-spacing")}
            </SButton>
            <SButton size="sm" onClick={onOk}>
              {tGlobal("ok-spacing")}
            </SButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
