import React from "react";
import { motion, type Spring } from "framer-motion";
import { useTranslations } from "next-intl";
import { shallow } from "zustand/shallow";
import { Select, Button } from "@ltopx/lx-ui";
import { useLLMStore } from "@/hooks/useLLM";
import { useChannelStore } from "@/hooks/useChannel";
import type { ChannelListItem } from "@/hooks/useChannel/types";
import { useModelCacheStore } from "@/hooks/useModelCache";
import { cn } from "@/lib";
import Icon from "@/components/icon";

interface ChatConfigureProps {
  list: ChannelListItem[];
  channel: ChannelListItem;
}

export const softBouncePrest: Spring = {
  type: "spring",
  damping: 10,
  stiffness: 100,
};

const renderLabel = (item: any) => {
  return (
    <div className="flex gap-2 items-center">
      {item.ico}
      {item.label}
    </div>
  );
};

const renderModelLabel = (item: any) => {
  return (
    <div className="flex gap-4 items-center">
      <span>{item.label}</span>
      {!!item.premium && (
        <span
          className={cn(
            "select-none rounded text-xs py-0.5 px-2 border",
            "border-amber-400 text-amber-400 bg-amber-50",
            "dark:border-orange-500 dark:text-orange-500 dark:bg-orange-50/90"
          )}
        >
          PREMIUM
        </span>
      )}
    </div>
  );
};

export default function ChatConfigure({ list, channel }: ChatConfigureProps) {
  const tPrompt = useTranslations("prompt");
  const tCommon = useTranslations("common");

  const [isShow, setIsShow] = React.useState(true);

  const [openai, azure] = useLLMStore(
    (state) => [state.openai, state.azure],
    shallow
  );
  const LLMOptions = React.useMemo(() => [openai, azure], [openai, azure]);

  const options =
    LLMOptions.find((item) => item.value === channel.channel_model.type)
      ?.models || [];

  const updateList = useChannelStore((state) => state.updateList);
  const updateType = useModelCacheStore((state) => state.updateType);
  const updateName = useModelCacheStore((state) => state.updateName);

  const onChangeType = (value: string) => {
    const newList: ChannelListItem[] = JSON.parse(JSON.stringify(list));
    const findCh = newList.find(
      (item) => item.channel_id === channel.channel_id
    );
    if (!findCh) return;
    const name =
      LLMOptions.find((val) => val.value === value)?.models[0].value || "";

    findCh.channel_model.type = value;
    findCh.channel_model.name = name;
    updateType(value);
    updateName(name);
    updateList(newList);
  };

  const onChangeModel = (value: string) => {
    const newList: ChannelListItem[] = JSON.parse(JSON.stringify(list));
    const findCh = newList.find(
      (item) => item.channel_id === channel.channel_id
    );
    if (!findCh) return;
    findCh.channel_model.name = value;
    updateName(value);
    updateList(newList);
  };

  React.useEffect(() => {
    setIsShow(false);
    setTimeout(() => {
      setIsShow(true);
    });
  }, [channel.channel_id]);

  if (!isShow) return null;

  return (
    <div className="flex flex-col h-full w-full pt-16 pb-24 top-0 left-0 gap-1 absolute">
      <motion.div
        className="mx-auto"
        initial={{ opacity: 0.0001, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={softBouncePrest}
      >
        <div
          className={cn(
            "w-[32.5rem] max-w-[calc(100vw-2rem)] transition-colors",
            "border rounded-md p-3.5 bg-white/90 dark:bg-gray-900/50",
            "border-neutral-200/70 dark:border-white/20"
          )}
        >
          <div>
            <Select
              className="w-full"
              size="lg"
              options={LLMOptions}
              renderLabel={renderLabel}
              value={channel.channel_model.type}
              onChange={onChangeType}
            />
            <div className="flex mt-4 gap-4 items-center">
              <div className="text-sm text-black/90 dark:text-white/90">
                {tPrompt("model")}
              </div>
              <div className="flex-1">
                <Select
                  className="w-full"
                  options={options}
                  renderLabel={renderModelLabel}
                  value={channel.channel_model.name}
                  onChange={onChangeModel}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-3">
          <Button
            rounded
            outline
            size="sm"
            type="success"
            onClick={() => window.open("https://docs.ltopx.com", "_blank")}
            icon={<Icon icon="document_line" size={18} />}
          >
            {tCommon("docs")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
