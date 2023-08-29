import React from "react";
import { useTranslations } from "next-intl";
import { Tabs, type TabsOption } from "@ltopx/lx-ui";
import { usePluginStore } from "@/hooks/usePlugin";
import GoogleSearch from "./googleSearch";
import Icon from "@/components/icon";

export default function PluginSetting() {
  const tGlobal = useTranslations("global");
  const tPlugin = useTranslations("plugin");

  const [activeTab, setActiveTab] = React.useState("google_search");

  const [google_search] = usePluginStore((state) => [state.google_search]);

  const count = React.useMemo(() => {
    return Number(!!google_search.enable);
  }, [google_search.enable]);

  const options: TabsOption[] = [
    {
      label: (
        <div className="flex items-center gap-2 justify-center">
          <Icon icon="google_line" size={15} />
          {tPlugin("google-search")}
        </div>
      ),
      value: "google_search",
      children: <GoogleSearch />,
    },
    {
      label: `${tGlobal("todo")}...`,
      value: "todo",
      children: <div>{tGlobal("todo")}...</div>,
    },
  ];

  return (
    <div>
      <div className="mb-2">
        {tGlobal("enabled")}: {count}
      </div>
      <Tabs
        itemsFull
        options={options}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
    </div>
  );
}
