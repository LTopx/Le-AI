import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ltopx/lx-ui";
import Icon from "@/components/icon";
import type { ChatItem } from "@/hooks/useChannel/types";

interface ChatTTSProps {
  data: ChatItem;
  disabled: boolean;
  onRead: () => void;
  onPause: () => void;
  onTTSSetting: () => void;
}

export default function ChatTTS({
  data,
  disabled,
  onRead,
  onPause,
  onTTSSetting,
}: ChatTTSProps) {
  const tGlobal = useTranslations("global");

  return (
    <div className="flex mt-2 items-center">
      <div className="flex gap-2 items-center">
        <Button
          size="sm"
          type="primary"
          outline
          rounded
          icon={<Icon icon="play_fill" size={17} />}
          loading={!!data.tts_loading}
          disabled={disabled}
          onClick={onRead}
        />
        {!!data.tts_loading && (
          <Button size="sm" outline type="warning" onClick={onPause}>
            <Icon icon="stop_fill" size={17} />
          </Button>
        )}
      </div>
      <Button
        className="opacity-0 transition-opacity select-none group-hover:opacity-100"
        type="link"
        disabled={disabled}
        onClick={onTTSSetting}
      >
        {tGlobal("setting")}
      </Button>
    </div>
  );
}
