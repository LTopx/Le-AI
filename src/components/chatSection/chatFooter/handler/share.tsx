import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ltopx/lx-ui";
import toast from "react-hot-toast";
import Icon from "@/components/icon";
import type { ChannelListItem } from "@/hooks/useChannel/types";
import type { ModelConfig } from "@/hooks/useLLM/types";
import type { IShare } from "@/app/api/share/route";
import Action from "@/components/share/action";

interface ShareProps {
  channel: ChannelListItem;
  llm: ModelConfig[];
}

export default function Share({ channel, llm }: ShareProps) {
  const tShare = useTranslations("share");
  const tGlobal = useTranslations("global");

  const actionRef = React.useRef<any>(null);

  const [loading, setLoading] = React.useState(false);

  const onShare = () => {
    const findModels =
      llm.find((e) => e.value === channel.channel_model.type)?.models || [];

    const findType = findModels.find(
      (e) => e.value === channel.channel_model.name
    )?.label;

    if (!findType) {
      return toast.error(tShare("model-error"), { id: "model-error" });
    }

    const params: IShare = {
      channel_model: {
        supplier: channel.channel_model.type,
        type: findType,
      },
      channel_name: channel.channel_name,
      channel_prompt: channel.channel_prompt,
      chat_content: channel.chat_list,
    };

    setLoading(true);
    fetch("/api/share", {
      method: "POST",
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error || !res.data?.id) {
          return toast.error(res.msg || tGlobal("service-error"), {
            id: "share-error",
          });
        }
        toast.success(tGlobal("operation-successful"), { id: "share-success" });
        actionRef.current?.init(res.data.id);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Button
        className="h-7 text-xs px-2.5"
        rounded
        outline
        type="primary"
        icon={<Icon icon="share_2_line" size={16} />}
        loading={loading}
        onClick={onShare}
      >
        <span className="hidden lg:block">{tGlobal("share")}</span>
      </Button>
      <Action ref={actionRef} />
    </>
  );
}
