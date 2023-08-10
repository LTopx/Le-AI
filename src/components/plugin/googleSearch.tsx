import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib";
import { Switch, Input } from "@ltopx/lx-ui";
import { usePluginStore } from "@/hooks/usePlugin";
import { useChannelStore } from "@/hooks/useChannel";

export default function GoogleSearch() {
  const tPlugin = useTranslations("plugin");
  const tCommon = useTranslations("common");

  const { enable, engine_id, api_key } = usePluginStore(
    (state) => state.google_search
  );

  const updateGoogleSearch = usePluginStore(
    (state) => state.updateGoogleSearch
  );
  const resetPlugin = useChannelStore((state) => state.resetPlugin);

  const onChangeEnable = (value: boolean) => {
    // if (value && (!engine_id?.trim() || !api_key?.trim())) {
    //   return console.log("请先配置");
    // }
    if (!value) resetPlugin("google_search");
    onChange("enable", value);
  };

  const onChange = (key: "enable" | "engine_id" | "api_key", value: any) => {
    const params: any = { enable, engine_id, api_key };
    params[key] = value;
    updateGoogleSearch(params);
  };

  return (
    <div className="border dark:border-gray-500 p-3 rounded-md flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch checked={enable} onChange={onChangeEnable} />
        <span>{tPlugin("enable-google-search")}</span>
      </div>
      <div className="text-green-400">{tPlugin("google-search-free")}</div>
      <div>
        <div className="mb-1 text-sm">{tPlugin("introduction")}</div>
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
              href="https://docs.ltopx.com/features/plugin"
              target="_blank"
            >
              {tPlugin("check-configure")}
            </a>
          </li>
        </ul>
      </div>
      <div>
        <div className="mb-1 text-sm">{tPlugin("engine-id")}</div>
        <Input
          allowClear
          placeholder={tCommon("please-enter")}
          value={engine_id}
          onChange={(value) => onChange("engine_id", value)}
        />
      </div>
      <div>
        <div className="mb-1 text-sm">{tPlugin("api-key")}</div>
        <Input
          allowClear
          placeholder={tCommon("please-enter")}
          value={api_key}
          onChange={(value) => onChange("api_key", value)}
        />
      </div>
    </div>
  );
}
