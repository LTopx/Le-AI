import React from "react";
import { useTranslations } from "next-intl";
import { Switch } from "@ltopx/lx-ui";
import { cn } from "@/lib";
import { useOpenStore } from "@/hooks/useOpen";
import { usePluginStore } from "@/hooks/usePlugin";
import { useChannelStore } from "@/hooks/useChannel";
import type { ChannelListItem } from "@/hooks/useChannel/types";
import Icon from "@/components/icon";

interface IPluginProps {
  channel: ChannelListItem;
}

export default function Plugin({ channel }: IPluginProps) {
  const tPlugin = useTranslations("plugin");
  const tGlobal = useTranslations("global");

  const [google_search] = usePluginStore((state) => [state.google_search]);

  const count = React.useMemo(() => {
    return Number(!!google_search.enable);
  }, [google_search.enable]);

  const updatePluginSettingOpen = useOpenStore(
    (state) => state.updatePluginSettingOpen
  );
  const updatePlugin = useChannelStore((state) => state.updatePlugin);

  const onToggle = (value: boolean, key: string) => {
    let plugins: string[] = [];
    if (value) {
      plugins = [...channel.channel_plugins, key];
    } else {
      plugins = channel.channel_plugins.filter((item) => item !== key);
    }
    updatePlugin(channel.channel_id, plugins);
  };

  return (
    <div className="flex justify-center mt-5">
      <div
        className={cn(
          "w-96 max-w-[calc(100vw-2rem)] dark:bg-[hsla(0,0%,100%,0.08)]",
          "flex flex-col items-center justify-between shadow-sm text-xs gap-2 px-4 py-3",
          "border border-[rgb(229,230,235)] dark:border-[hsla(0,0%,100%,0.08)]",
          "select-none rounded-lg transition-colors",
          "flex relative"
        )}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Icon icon="plugin_2_line" />
          <div className="text-gray-600 dark:text-[hsla(0,0%,100%,0.9)] max-h-[300px] overflow-y-auto">
            {tGlobal("plugins")} ({channel.channel_plugins.length}/{count})
          </div>
        </div>
        <div className="absolute right-2 top-2.5">
          <Icon
            className={cn(
              "transition-colors cursor-pointer",
              "text-sky-400 hover:text-sky-400/70 dark:text-sky-500 dark:hover:text-sky-600"
            )}
            icon="settings_3_line"
            size={20}
            onClick={() => updatePluginSettingOpen(true)}
          />
        </div>
        {count ? (
          <div className="w-full flex flex-col gap-2">
            {google_search.enable && (
              <div
                className={cn(
                  "bg-white dark:bg-zinc-800 h-12 rounded-md flex items-center justify-between px-2",
                  "border dark:border-zinc-600"
                )}
              >
                <div className="flex gap-1.5 items-center">
                  <Icon icon="google_line" size={18} />
                  <span className="text-[13px] font-medium">
                    {tPlugin("google-search")}
                  </span>
                </div>
                <Switch
                  className="h-4 w-8"
                  thumbClassName="w-3 h-3 translate-x-0.5 data-[state=checked]:translate-x-[18px]"
                  checked={channel.channel_plugins.includes("google_search")}
                  onChange={(value) => onToggle(value, "google_search")}
                />
              </div>
            )}
          </div>
        ) : (
          <div>{tPlugin("enable-first")}</div>
        )}
      </div>
    </div>
  );
}
