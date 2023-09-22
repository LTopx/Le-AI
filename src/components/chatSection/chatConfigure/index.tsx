import React from "react";
import { motion, type Spring } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@ltopx/lx-ui";
import { useLLMStore } from "@/hooks/useLLM";
import { useChannelStore } from "@/hooks/useChannel";
import { useOpenStore } from "@/hooks/useOpen";
import type { ChannelListItem, ChannelIcon } from "@/hooks/useChannel/types";
import { useModelCacheStore } from "@/hooks/useModelCache";
import { cn } from "@/lib";
import Icon from "@/components/icon";
import PremiumBtn from "./premiumBtn";
import MenuIcon from "@/components/menu/icon";
import Plugin from "./plugin";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChatConfigureProps {
  list: ChannelListItem[];
  channel: ChannelListItem;
}

export const softBouncePrest: Spring = {
  type: "spring",
  damping: 10,
  stiffness: 100,
};

export default function ChatConfigure({ list, channel }: ChatConfigureProps) {
  const tGlobal = useTranslations("global");

  const [isShow, setIsShow] = React.useState(true);
  const [isAnimation, setIsAnimation] = React.useState(false);

  const [openai, azure, openRouter] = useLLMStore((state) => [
    state.openai,
    state.azure,
    state.openRouter,
  ]);
  const LLMOptions = React.useMemo(
    () => [openai, azure, openRouter],
    [openai, azure, openRouter]
  );

  const options =
    LLMOptions.find((item) => item.value === channel.channel_model.type)
      ?.models || [];

  const updateList = useChannelStore((state) => state.updateList);
  const updateType = useModelCacheStore((state) => state.updateType);
  const updateName = useModelCacheStore((state) => state.updateName);
  const updateCharacterOpen = useOpenStore(
    (state) => state.updateCharacterOpen
  );

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
        className={cn("mx-auto", { "pointer-events-none": isAnimation })}
        initial={{ opacity: 0.0001, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={softBouncePrest}
        onAnimationStart={() => setIsAnimation(true)}
        onAnimationComplete={() => setIsAnimation(false)}
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
              value={channel.channel_model.type}
              onValueChange={onChangeType}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {LLMOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      <div className="flex gap-2 items-center">
                        {item.ico}
                        {item.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex mt-4 gap-4 items-center">
              <div className="text-sm text-black/90 dark:text-white/90">
                {tGlobal("model")}
              </div>
              <div className="flex-1">
                <Select
                  value={channel.channel_model.name}
                  onValueChange={onChangeModel}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        <div className="flex gap-4 items-center">
                          <div className="flex items-center gap-1.5">
                            {!!item.icon && <span>{item.icon}</span>}
                            <span>{item.label}</span>
                          </div>
                          {!!item.premium && (
                            <span
                              className={cn(
                                "select-none rounded text-xs py-0.5 px-2 border",
                                "border-amber-400 text-amber-400 bg-amber-50",
                                "dark:border-orange-500 dark:text-orange-500 dark:bg-orange-50/90"
                              )}
                            >
                              PRO
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-3">
          <PremiumBtn />
          <Button
            rounded
            outline
            size="sm"
            type="success"
            onClick={() => window.open("https://docs.le-ai.app", "_blank")}
            icon={<Icon icon="document_line" size={18} />}
          >
            {tGlobal("docs")}
          </Button>
        </div>
        <div className="flex justify-center mt-5">
          <div
            className={cn(
              "w-96 max-w-[calc(100vw-2rem)] dark:bg-[hsla(0,0%,100%,0.08)]",
              "flex flex-col items-center justify-between shadow-sm text-xs gap-2 px-4 py-3",
              "dark:text-[hsla(0,0%,100%,0.9)]",
              "border border-[rgb(229,230,235)] dark:border-[hsla(0,0%,100%,0.08)]",
              "select-none rounded-lg transition-colors cursor-pointer",
              "hover:bg-[rgb(229,230,235)] dark:hover:bg-[hsla(0,0%,100%,0.12)]"
            )}
            onClick={() => updateCharacterOpen(true)}
          >
            <div className="flex items-center gap-1.5">
              <MenuIcon
                className="w-4 h-4"
                name={channel.channel_icon as ChannelIcon}
              />
              <div>{channel.channel_prompt_name}</div>
            </div>
            <div className="text-gray-600 dark:text-[hsla(0,0%,100%,0.9)] max-h-[150px] overflow-y-auto">
              {channel.channel_prompt}
            </div>
          </div>
        </div>
        {channel.channel_model.type !== "openRouter" && (
          <Plugin channel={channel} />
        )}
      </motion.div>
    </div>
  );
}
