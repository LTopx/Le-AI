import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { useDebounceFn } from "ahooks";
import { Modal, Tabs, Button, Confirm, type TabsOption } from "@ltopx/lx-ui";
import { useOpenStore } from "@/hooks/useOpen";
import { useChannelStore } from "@/hooks/useChannel";
import { cn } from "@/lib";
import { characters, type Character, type Characters } from "@/lib/character";
import { useCharacterStore } from "@/hooks/useCharacter";
import MenuIcon from "../menu/icon";
import Icon from "@/components/icon";
import Create from "./create";

type CharacterListItem = Character & { isCollected: boolean };

export default function Character() {
  const tCharacter = useTranslations("character");
  const tGlobal = useTranslations("global");

  const locale = useLocale();
  const myCharacterList = useCharacterStore((state) => state.list);

  const [open, setOpen] = useOpenStore((state) => [
    state.characterOpen,
    state.updateCharacterOpen,
  ]);
  const [activeTab, setActiveTab] = React.useState(
    "all" as TabsOption["value"]
  );

  const options: TabsOption[] = [
    {
      label: tGlobal("all"),
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
      label: tGlobal("translate"),
      value: "translate",
    },
    {
      label: tCharacter("mine"),
      value: "mine",
    },
  ];

  const lists: CharacterListItem[] = React.useMemo(() => {
    if (activeTab === "all") {
      return characters[locale as keyof Characters].map((item) => {
        const findMine = myCharacterList.find((i) => i.id === item.id);
        return { ...item, isCollected: !!findMine };
      });
    }

    if (activeTab === "mine") {
      return myCharacterList.map((item) => ({ ...item, isCollected: true }));
    }

    return characters[locale as keyof Characters]
      .filter((item) => item.type === activeTab)
      .map((item) => {
        const findMine = myCharacterList.find((i) => i.id === item.id);
        return { ...item, isCollected: !!findMine };
      });
  }, [activeTab, myCharacterList, locale]);

  const { run: onCollect } = useDebounceFn(
    (item: CharacterListItem) => {
      if (item.isCollected) {
        deleteCharacter(item.id);
      } else {
        addCharacter(item);
      }
    },
    { wait: 500 }
  );

  const updateCharacter = useChannelStore((state) => state.updateCharacter);
  const addCharacter = useCharacterStore((state) => state.addList);
  const deleteCharacter = useCharacterStore((state) => state.deleteItem);

  const onClose = () => setOpen(false);

  const onUse = (item: Character) => {
    updateCharacter(item);
    setOpen(false);
  };

  const onDelete = (id: string) => deleteCharacter(id);

  React.useEffect(() => {
    if (open) setActiveTab("all");
  }, [open]);

  return (
    <>
      <Modal
        title={`AI ${tCharacter("character")}`}
        width="1366px"
        maskClosable={false}
        open={open}
        onClose={onClose}
        footer={null}
      >
        <Tabs
          options={options}
          activeTab={activeTab}
          onChange={setActiveTab}
          extra={<Create className="hidden lg:flex" />}
        />
        <Create className="mb-4 lg:hidden" />

        {lists.length ? (
          <div className="h-[50vh] grid gap-4 grid-cols-1 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  <div className="rounded-md flex bg-neutral-200 h-8 w-8 justify-center items-center dark:bg-neutral-500/80">
                    <MenuIcon className="h-5 w-5" name={item.icon as any} />
                  </div>
                  <div className="font-semibold">{item.name}</div>
                </div>
                <div className="flex-1 pt-3 pb-1 text-gray-500 overflow-y-auto dark:text-gray-400">
                  {item.desc}
                </div>
                <div className="flex h-7 text-gray-500 items-center dark:text-gray-400 group-hover:invisible">
                  <div className="border rounded-full flex h-6 text-xs px-3 items-center justify-center dark:border-gray-500">
                    {tCharacter(item.type)}
                  </div>
                </div>
                <div className="w-full px-3 bottom-3 left-0 gap-2 hidden absolute justify-center group-hover:flex">
                  <div className="flex-1">
                    <Button
                      size="sm"
                      type="primary"
                      icon={<Icon icon="add_line" />}
                      onClick={() => onUse(item)}
                    >
                      {tGlobal("apply")}
                    </Button>
                  </div>

                  {activeTab === "mine" ? (
                    <Confirm
                      triggerClassName="flex-1"
                      title={tGlobal("delete")}
                      content={tGlobal("delete-tip")}
                      onOk={() => onDelete(item.id)}
                      okText={tGlobal("ok-spacing")}
                      cancelText={tGlobal("cancel-spacing")}
                      type="danger"
                    >
                      <Button
                        size="sm"
                        type="danger"
                        icon={<Icon icon="delete_2_line" />}
                      >
                        {tGlobal("delete")}
                      </Button>
                    </Confirm>
                  ) : (
                    <div className="flex-1">
                      <Button
                        size="sm"
                        icon={
                          <Icon
                            className={cn({
                              "text-yellow-400": item.isCollected,
                            })}
                            icon={item.isCollected ? "star_fill" : "star_line"}
                          />
                        }
                        onClick={() => onCollect(item)}
                      >
                        {item.isCollected
                          ? tGlobal("collected")
                          : tGlobal("collect")}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[50vh] gap-2 justify-center items-center">
            <Icon icon="warning_fill" size={18} />
            {tGlobal("no-data")}
          </div>
        )}
      </Modal>
    </>
  );
}
