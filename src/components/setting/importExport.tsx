import React from "react";
import { useTranslations, useFormatter } from "next-intl";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { cn } from "@/lib";
import { Button } from "@ltopx/lx-ui";
import Icon from "@/components/icon";
import { useOpenAIStore } from "@/hooks/useOpenAI";
import { useChannelStore } from "@/hooks/useChannel";
import { useOpenStore } from "@/hooks/useOpen";
import { useCharacterStore } from "@/hooks/useCharacter";

export default function ImportExport() {
  const format = useFormatter();

  const tGlobal = useTranslations("global");

  const [openai, azure, openRouter] = useOpenAIStore((state) => [
    state.openai,
    state.azure,
    state.openRouter,
  ]);
  const [activeId, list] = useChannelStore((state) => [
    state.activeId,
    state.list,
  ]);

  const characterList = useCharacterStore((state) => state.list);

  const updateActiveId = useChannelStore((state) => state.updateActiveId);
  const updateList = useChannelStore((state) => state.updateList);
  const updateOpenAI = useOpenAIStore((state) => state.updateOpenAI);
  const updateAzure = useOpenAIStore((state) => state.updateAzure);
  const updateOpenRouter = useOpenAIStore((state) => state.updateOpenRouter);
  const updateSettingOpen = useOpenStore((state) => state.updateSettingOpen);
  const importCharacterList = useCharacterStore((state) => state.importList);

  // ref
  const fileRef = React.useRef<any>(null);

  const onExport = () => {
    const exportData = {
      configure: { openai, azure, openRouter },
      messages: { activeId, list },
      characters: characterList.map((item) => ({
        id: item.id,
        icon: item.icon,
        type: item.type,
        handle_type: item.handle_type,
        name: item.name,
        desc: item.desc,
        content: item.content,
        welcome: item.welcome || "",
        model_config: item.model_config,
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
          const { openai, azure, openRouter } = json.configure;
          updateOpenAI(openai);
          updateAzure(azure);
          updateOpenRouter(openRouter);
        }
        if (json.characters?.length) {
          importCharacterList(json.characters);
        }

        updateSettingOpen(false);
        toast.success(tGlobal("operation-successful"));
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
        <div className="text-sm">{tGlobal("export-import")}</div>
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
