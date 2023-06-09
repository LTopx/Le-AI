import * as React from "react";
import { useDateFormat } from "l-hooks";
import { useTranslations } from "next-intl";
import { v4 as uuidv4 } from "uuid";
import { RiTranslate } from "react-icons/ri";
import { Prompt } from "@prisma/client";
import { useChannel, usePromptRecent } from "@/hooks";
import type { ChannelIcon } from "@/hooks";
import Modal from "@/components/ui/Modal";
import Divider from "@/components/ui/Divider";
import Button from "@/components/ui/Button";

interface ApplyProps {
  onChoose: () => void;
}

const Apply = React.forwardRef<any, ApplyProps>(
  ({ onChoose }, forwardedRef) => {
    const t = useTranslations("prompt");
    const tCommon = useTranslations("common");
    const [, setChannel] = useChannel();
    const [, setRecentPrompt] = usePromptRecent();
    const [open, setOpen] = React.useState(false);
    const [info, setInfo] = React.useState<Prompt>();
    const [lanType, setLanType] = React.useState<"cn" | "en">("cn");

    const { format } = useDateFormat();

    const onClose = () => setOpen(false);

    const onToggleLan = () => {
      setLanType(lanType === "cn" ? "en" : "cn");
    };

    const onOk = () => {
      if (!info) return;
      setOpen(false);
      onChoose();

      const prompt = (info?.content as any)?.[lanType] || "";

      setChannel((channel) => {
        const { list, activeId } = channel;
        const findCh = list.find((item) => item.channel_id === activeId);
        if (!findCh) return channel;
        if (findCh.chat_list?.length) {
          findCh.chat_list.push({
            id: uuidv4(),
            role: "assistant",
            time: String(+new Date()),
            content: prompt,
          });
        } else {
          findCh.channel_icon =
            (info?.icon as ChannelIcon) || "RiChatSmile2Line";
          findCh.channel_name = info?.title || "";
          findCh.channel_prompt = prompt;
        }
        return channel;
      });

      setRecentPrompt((prompt) => {
        const findIndex = prompt.list.findIndex((item) => item.id === info.id);
        if (findIndex !== -1) {
          if (findIndex) {
            const [item] = prompt.list.splice(findIndex, 1);
            prompt.list.unshift(item);
          }
          return prompt;
        }

        prompt.list.unshift({
          id: info.id,
          title: info.title,
          icon: info.icon,
          desc: info.desc,
          content: {
            cn: (info.content as any)?.cn,
            en: (info.content as any)?.en,
          },
        });

        if (prompt.list.length > 6) prompt.list = prompt.list.slice(0, 6);

        return prompt;
      });
    };

    React.useImperativeHandle(forwardedRef, () => ({
      init(data: Prompt) {
        if ((data.content as any)?.cn) {
          setLanType("cn");
        } else {
          setLanType("en");
        }
        setInfo(data);
        setOpen(true);
      },
    }));

    return (
      <Modal
        title={<div className="text-sky-400">{info?.title}</div>}
        maskClosable={false}
        open={open}
        onClose={onClose}
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>{tCommon("cancel")}</Button>
            <Button type="primary" onClick={onOk}>
              {t("start-conversation")}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col text-[15px] text-neutral-700 gap-2">
          <div className="text-sm">{info?.desc}</div>
          <Divider className="my-1" />
          <div className="relative">
            <div className="h-60 overflow-y-auto pt-4">
              {(info?.content as any)?.[lanType]}
            </div>
            {(info?.content as any)?.cn && (info?.content as any)?.en && (
              <Button
                type="primary"
                size="xs"
                className="absolute right-0 top-[-0.5rem]"
                onClick={onToggleLan}
              >
                <RiTranslate size={18} />
              </Button>
            )}
          </div>
          <Divider className="my-1" />
          <div className="flex text-sm gap-2 items-center">
            {info?.creatorName
              ? info?.creatorName === "system"
                ? "system"
                : "@" + info?.creatorName
              : ""}
            {info?.creatorName && <span>/</span>}
            {format(info?.updatedAt as any, "YYYY-MM-DD")}
          </div>
        </div>
      </Modal>
    );
  }
);

Apply.displayName = "Apply";

export default Apply;
