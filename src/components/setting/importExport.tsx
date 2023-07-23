import React from "react";
import { useTranslations, useFormatter } from "next-intl";
import { shallow } from "zustand/shallow";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib";
import { Button } from "@ltopx/lx-ui";
import Icon from "@/components/icon";
import { useOpenAIStore } from "@/hooks/useOpenAI";
import { useChannelStore } from "@/hooks/useChannel";
import { usePromptStore } from "@/hooks/usePrompt";
import { useOpenStore } from "@/hooks/useOpen";

export default function ImportExport() {
  const format = useFormatter();

  const tSetting = useTranslations("setting");

  const [openai, azure] = useOpenAIStore(
    (state) => [state.openai, state.azure],
    shallow
  );
  const [activeId, list] = useChannelStore(
    (state) => [state.activeId, state.list],
    shallow
  );

  const [prompts, setPrompts] = usePromptStore(
    (state) => [state.list, state.updateList],
    shallow
  );

  const updateActiveId = useChannelStore((state) => state.updateActiveId);
  const updateList = useChannelStore((state) => state.updateList);
  const updateOpenAI = useOpenAIStore((state) => state.updateOpenAI);
  const updateAzure = useOpenAIStore((state) => state.updateAzure);
  const updateSettingOpen = useOpenStore((state) => state.updateSettingOpen);

  // ref
  const fileRef = React.useRef<any>(null);

  const onExport = () => {
    const exportData = {
      configure: { openai, azure },
      messages: { activeId, list },
      prompts: prompts.map((item) => ({
        title: item.title,
        icon: item.icon,
        desc: item.desc,
        content: item.content,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, `LGPT_Export_${format.dateTime(new Date())}.json`);
  };

  const onImport = (files: any) => {
    if (!files?.length) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.messages) {
          const { activeId, list } = json.messages;
          const find = list.find((item: any) => item.channel_id === activeId);
          if (find) {
            updateActiveId(activeId);
            updateList(list);
          }
        }
        if (json.configure) {
          const { openai, azure } = json.configure;
          updateOpenAI(openai);
          updateAzure(azure);
        }

        if (json.prompts?.length) {
          const arr = json.prompts.map((item: any) => ({
            id: uuidv4(),
            title: item.title,
            icon: item.icon,
            desc: item.desc,
            content: item.content,
          }));
          setPrompts([...prompts, ...arr]);
        }

        updateSettingOpen(false);
        toast.success(tSetting("import-success"));
      } catch {}
    };
    reader.readAsText(file);
    fileRef.current.value = "";
  };

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between py-2 px-1 border-b",
          "border-slate-100 dark:border-neutral-500/60"
        )}
      >
        <div className="text-sm">{tSetting("export-import")}</div>
        <div className="flex gap-2">
          <Button onClick={onExport}>
            <Icon icon="upload_3_line" size={18} />
          </Button>
          <Button onClick={() => fileRef.current?.click()}>
            <Icon icon="download_3_line" size={18} />
          </Button>
        </div>
      </div>
      <input
        ref={fileRef}
        className="sr-only"
        tabIndex={-1}
        type="file"
        accept=".json"
        onChange={(e) => onImport(e.target.files)}
      />
    </>
  );
}
