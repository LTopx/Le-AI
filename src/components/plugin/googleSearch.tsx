import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib";
import { Switch, Input } from "@ltopx/lx-ui";
import { usePluginStore } from "@/hooks/usePlugin";
import { useChannelStore } from "@/hooks/useChannel";

export default function GoogleSearch() {
  const tGlobal = useTranslations("global");
  const tPlugin = useTranslations("plugin");

  const { enable, api_key } = usePluginStore((state) => state.google_search);

  const updateGoogleSearch = usePluginStore(
    (state) => state.updateGoogleSearch
  );
  const resetPlugin = useChannelStore((state) => state.resetPlugin);

  const onChangeEnable = (value: boolean) => {
    // if (value &&  !api_key?.trim()) {
    //   return console.log("请先配置");
    // }
    if (!value) resetPlugin("google_search");
    onChange("enable", value);
  };

  const onChange = (key: "enable" | "api_key", value: any) => {
    const params: any = { enable, api_key };
    params[key] = value;
    updateGoogleSearch(params);
  };

  return (
    <div className="border rounded-md flex flex-col p-3 gap-3 dark:border-gray-500">
      <div className="flex gap-2 items-center">
        <Switch checked={enable} onChange={onChangeEnable} />
        <span>{tPlugin("enable-google-search")}</span>
      </div>
      <div className="text-green-400">{tPlugin("google-search-free")}</div>
      <div>
        <div className="text-sm mb-1">{tGlobal("introduction")}</div>
        <ul
          className={cn(
            "bg-sky-50 dark:bg-sky-900",
            "text-slate-500 dark:text-slate-300",
            "rounded-md list-disc space-y-1 py-2 pl-6 marker:text-sky-400"
          )}
        >
          <li>{tPlugin("introduction-1")}</li>
          <li>{tPlugin("introduction-2")}</li>
          <li>
            <a
              className="text-sky-500 hover:underline"
              href="https://docs.le-ai.app/features/plugin"
              target="_blank"
            >
              {tGlobal("learn-more")}
            </a>
          </li>
        </ul>
      </div>
      <div>
        <div className="text-sm mb-1">{tPlugin("serper-api-key")}</div>
        <Input
          allowClear
          placeholder={tGlobal("please-enter")}
          value={api_key}
          onChange={(value) => onChange("api_key", value)}
        />
      </div>
    </div>
  );
}
