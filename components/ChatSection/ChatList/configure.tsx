import * as React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { useChannel } from "@/hooks";
import { Select } from "@/components";
import { AI_MODELS } from "@/utils/models";
import { PROMPT_DEFAULT } from "@/prompt";
import type { Prompt } from "@/prompt";

const renderLabel = (item: any) => {
  return (
    <div className="flex items-center gap-2">
      {item.ico}
      {item.label}
    </div>
  );
};

const Configure: React.FC = () => {
  const [channel, setChannel] = useChannel();
  const [isShow, setIsShow] = React.useState(true);

  const { findChannel, options } = React.useMemo(() => {
    const findChannel = channel.list.find(
      (item) => item.channel_id === channel.activeId
    );
    const options =
      AI_MODELS.find((item) => item.value === findChannel?.channel_model.type)
        ?.models || [];

    return { findChannel, options };
  }, [channel]);

  const { t } = useTranslation("prompt");

  const onChangeType = (value: string) => {
    setChannel((channel) => {
      const { list, activeId } = channel;
      const nowChannel = list.find((item) => item.channel_id === activeId);
      if (!nowChannel) return channel;
      nowChannel.channel_model.type = value;
      nowChannel.channel_model.name =
        AI_MODELS.find((val) => val.value === value)?.models[0].value || "";
      return channel;
    });
  };

  const onChangeModel = (value: string) => {
    setChannel((channel) => {
      const { list, activeId } = channel;
      const nowChannel = list.find((item) => item.channel_id === activeId);
      if (!nowChannel) return channel;
      nowChannel.channel_model.name = value;
      return channel;
    });
  };

  const handlePrompt = (item: Prompt) => {
    setChannel((channel) => {
      const { list, activeId } = channel;
      const findCh = list.find((item) => item.channel_id === activeId);
      if (!findCh) return channel;
      findCh.channel_icon = item.icon;
      findCh.channel_name = item.title;
      findCh.channel_prompt = item.content;
      return channel;
    });
  };

  React.useEffect(() => {
    setIsShow(false);
    setTimeout(() => {
      setIsShow(true);
    }, 100);
  }, [channel.activeId]);

  return (
    <div className="h-full w-full left-0 top-0 absolute pt-16 pb-24 flex flex-col gap-4">
      {isShow && (
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: -300 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
            y: {
              type: "spring",
              damping: 15,
              stiffness: 200,
            },
          }}
        >
          <div
            className={clsx(
              "w-[32.5rem] max-w-[calc(100vw-2rem)]",
              "border rounded-md p-3.5 bg-white/90 dark:bg-gray-900/50",
              "border-neutral-200/70 dark:border-white/20"
            )}
          >
            <div>
              <Select
                className="w-full"
                size="large"
                options={AI_MODELS}
                renderLabel={renderLabel}
                value={findChannel?.channel_model.type}
                onChange={onChangeType}
              />
              <div className="flex items-center gap-4 mt-4">
                <div className="text-sm text-black/90 dark:text-white/90">
                  {t("model")}
                </div>
                <div className="flex-1">
                  <Select
                    className="w-full"
                    options={options}
                    value={findChannel?.channel_model.name}
                    onChange={onChangeModel}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-[32.5rem] max-w-[calc(100vw-2rem)] mt-4 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex gap-2">
              {PROMPT_DEFAULT.slice(0, 2).map((item) => (
                <motion.button
                  key={item.label}
                  className={clsx(
                    "flex-1 h-12 border border-neutral-200/70 bg-sky-50 rounded-md text-sm text-black/90",
                    "dark:bg-transparent dark:text-white/90 dark:border-white/40"
                  )}
                  whileHover={{
                    scale: 1.07,
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePrompt(item)}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
            <div className="flex-1 flex gap-2">
              {PROMPT_DEFAULT.slice(2, 4).map((item) => (
                <motion.button
                  key={item.label}
                  className={clsx(
                    "flex-1 h-12 border border-neutral-200/70 bg-sky-50 rounded-md text-sm text-black/90",
                    "dark:bg-transparent dark:text-white/90 dark:border-white/40"
                  )}
                  whileHover={{
                    scale: 1.07,
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePrompt(item)}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* {isShow && (
        <motion.div
          className=""
          initial={{ opacity: 0, y: 300 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
            y: {
              type: "spring",
              damping: 20,
              stiffness: 200,
            },
          }}
        >
          <div>asfasf</div>
          <div>asfasf</div>
          <div>asfasf</div>
          <div>asfasf</div>
          <div>asfasf</div>
        </motion.div>
      )} */}
    </div>
  );
};

export default Configure;
