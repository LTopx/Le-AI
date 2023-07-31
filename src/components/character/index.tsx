import React from "react";
import { useTranslations, useLocale } from "next-intl";
import toast from "react-hot-toast";
import { Modal, Tabs, Button, type TabsOption } from "@ltopx/lx-ui";
import { shallow } from "zustand/shallow";
import { useOpenStore } from "@/hooks/useOpen";
import { useChannelStore } from "@/hooks/useChannel";
import { cn } from "@/lib";
import { characters, type Character, type Characters } from "@/lib/character";
import MenuIcon from "../menu/icon";
import Icon from "@/components/icon";

export default function Character() {
  const tCharacter = useTranslations("character");
  const tCommon = useTranslations("common");

  const locale = useLocale();

  const [open, setOpen] = useOpenStore(
    (state) => [state.characterOpen, state.updateCharacterOpen],
    shallow
  );
  const [activeTab, setActiveTab] = React.useState(
    "all" as TabsOption["value"]
  );

  const options: TabsOption[] = [
    {
      label: tCharacter("all"),
      value: "all",
    },
    {
      label: tCharacter("role-play"),
      value: "role-play",
    },
    {
      label: tCharacter("helper"),
      value: "helper",
    },
    {
      label: tCharacter("hr"),
      value: "hr",
    },
    {
      label: tCharacter("writing"),
      value: "writing",
    },
    {
      label: tCharacter("translate"),
      value: "translate",
    },
  ];

  const lists: Character[] = React.useMemo(() => {
    if (activeTab === "all") return characters[locale as keyof Characters];
    return characters[locale as keyof Characters].filter(
      (item) => item.type === activeTab
    );
  }, [activeTab, locale]);

  const updateCharacter = useChannelStore((state) => state.updateCharacter);

  const onClose = () => setOpen(false);

  const onUse = (item: Character) => {
    updateCharacter(item);
    setOpen(false);
  };

  const onCollect = () => toast.error(tCommon("todo"), { id: "todo" });

  React.useEffect(() => {
    if (open) setActiveTab("all");
  }, [open]);

  return (
    <Modal
      title={tCharacter("ai-character")}
      width="calc(100vw - 5rem)"
      maskClosable={false}
      open={open}
      onClose={onClose}
      footer={null}
    >
      <Tabs options={options} activeTab={activeTab} onChange={setActiveTab} />

      <div className="max-h-[50vh] grid gap-4 grid-cols-1 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {lists.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex flex-col h-48 p-3 select-none cursor-pointer rounded-md relative group",
              "border dark:border-gray-500",
              "transition-all hover:shadow-md"
            )}
          >
            <div className="flex gap-2 items-center">
              <div className="rounded-md flex bg-neutral-200 dark:bg-neutral-500/80 h-8 w-8 justify-center items-center">
                <MenuIcon className="w-5 h-5" name={item.icon as any} />
              </div>
              <div className="font-semibold">{item.name}</div>
            </div>
            <div className="flex-1 pt-3 pb-1 overflow-y-auto text-gray-500 dark:text-gray-400">
              {item.desc}
            </div>
            <div className="flex h-7 items-center text-gray-500 dark:text-gray-400 group-hover:invisible">
              <div className="text-xs h-6 border dark:border-gray-500 flex items-center justify-center px-3 rounded-full">
                {tCharacter(item.type)}
              </div>
            </div>
            <div className="w-full px-3 bottom-3 left-0 gap-2 hidden absolute justify-center group-hover:flex">
              <Button
                size="sm"
                type="primary"
                className="flex-1"
                icon={<Icon icon="add_line" />}
                onClick={() => onUse(item)}
              >
                {tCommon("apply")}
              </Button>
              <Button
                size="sm"
                className="flex-1"
                icon={<Icon icon="star_line" />}
                onClick={onCollect}
              >
                {tCommon("collect")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
