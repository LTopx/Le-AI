import React from "react";
import { useTranslations } from "next-intl";
import { Button, Confirm } from "@ltopx/lx-ui";
import Icon from "@/components/icon";
import CopyIcon from "@/components/site/copyIcon";

interface HandlerProps {
  content: string;
  onDelete: () => void;
  onRegenerate: () => void;
}

export default function Handler({
  content,
  onDelete,
  onRegenerate,
}: HandlerProps) {
  const tChat = useTranslations("chat");
  const tCommon = useTranslations("common");

  return (
    <div className="flex opacity-0 transition-opacity gap-1.5 group-hover:opacity-100">
      <Button className="h-6 px-2" type="primary" outline size="sm" rounded>
        <CopyIcon size={16} content={content} />
      </Button>
      <Confirm
        title={tChat("delete-chat")}
        content={tChat("delete-chat-tip")}
        onOk={onDelete}
        okText={tCommon("ok")}
        cancelText={tCommon("cancel")}
        type="danger"
      >
        <Button className="h-6 px-2" type="primary" size="sm" outline rounded>
          <Icon icon="delete_2_line" size={16} />
        </Button>
      </Confirm>
      <Button
        className="h-6 px-2"
        type="primary"
        outline
        size="sm"
        rounded
        onClick={onRegenerate}
      >
        <Icon icon="refresh_3_line" size={16} />
      </Button>
    </div>
  );
}
