import * as React from "react";
import { useTranslations } from "next-intl";
import { ImPlay3 } from "react-icons/im";
import { BsStopFill } from "react-icons/bs";
import type { ChatItem, LicenseType } from "@/hooks";
import { Divider, Button, Link } from "@/components/ui";

interface Props {
  data: ChatItem;
  license_type: LicenseType;
  onRead: () => void;
  onPause: () => void;
  onTTSSetting: () => void;
}

const TTSHandler: React.FC<Props> = ({
  data,
  license_type,
  onRead,
  onPause,
  onTTSSetting,
}) => {
  const tTTS = useTranslations("tts");

  if (
    data.role !== "assistant" ||
    (license_type !== "premium" && license_type !== "team")
  )
    return null;

  return (
    <>
      <Divider className="border-b-neutral-400/20 my-2 dark:border-b-neutral-200/20" />
      <div className="flex gap-2 items-center">
        <Button
          type="outline"
          size="xs"
          leftIcon={<ImPlay3 size={14} />}
          loading={data.tts_loading}
          onClick={onRead}
        />
        {data.tts_loading && (
          <Button size="xs" type="primary" onClick={onPause}>
            <BsStopFill size={18} />
          </Button>
        )}
        <Link
          className="text-sm transition-opacity group-hover/item:opacity-100 md:opacity-0"
          onClick={onTTSSetting}
        >
          {tTTS("setting-icon")}
        </Link>
      </div>
    </>
  );
};

export default TTSHandler;
