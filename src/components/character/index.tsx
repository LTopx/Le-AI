import React from "react";
import { useTranslations, useLocale } from "next-intl";
import toast from "react-hot-toast";
import { Modal, Tabs, Button, Confirm, type TabsOption } from "@ltopx/lx-ui";
import { shallow } from "zustand/shallow";
import { useOpenStore } from "@/hooks/useOpen";
import { useChannelStore } from "@/hooks/useChannel";
import { cn } from "@/lib";
import { characters, type Character, type Characters } from "@/lib/character";
import { useCharacterStore } from "@/hooks/useCharacter";
import MenuIcon from "../menu/icon";
import Icon from "@/components/icon";
import Create from "./create";

export default function Character() {
  const tCharacter = useTranslations("character");
  const tCommon = useTranslations("common");

  const createRef = React.useRef<any>(null);

  const locale = useLocale();
  const myCharacterList = useCharacterStore((state) => state.list);

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
    {
      label: tCharacter("mine"),
      value: "mine",
    },
  ];

  const lists: Character[] = React.useMemo(() => {
    if (activeTab === "all") return characters[locale as keyof Characters];
    if (activeTab === "mine") return myCharacterList;
    return characters[locale as keyof Characters].filter(
      (item) => item.type === activeTab
    );
  }, [activeTab, myCharacterList, locale]);

  const updateCharacter = useChannelStore((state) => state.updateCharacter);
  const deleteCharacter = useCharacterStore((state) => state.deleteItem);

  const onClose = () => setOpen(false);

  const onUse = (item: Character) => {
    updateCharacter(item);
    setOpen(false);
  };

  const onCollect = () => toast.error(tCommon("todo"), { id: "todo" });

  const onAdd = () => createRef.current?.init();

  const onDelete = (id: string) => deleteCharacter(id);

  React.useEffect(() => {
    if (open) setActiveTab("all");
  }, [open]);

  return (
    <>
      <Modal
        title={tCharacter("ai-character")}
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
          extra={
            <Button
              className="hidden lg:flex"
              type="primary"
              icon={<Icon icon="add_line" />}
              onClick={onAdd}
            >
              {tCharacter("create")}
            </Button>
          }
        />
        <Button
          type="primary"
          className="mb-4 lg:hidden"
          icon={<Icon icon="add_line" />}
          onClick={onAdd}
        >
          {tCharacter("create")}
        </Button>

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
                      {tCommon("apply")}
                    </Button>
                  </div>

                  {activeTab === "mine" ? (
                    <Confirm
                      triggerClassName="flex-1"
                      title={tCharacter("delete")}
                      content={tCharacter("delete-tip")}
                      onOk={() => onDelete(item.id)}
                      okText={tCommon("ok")}
                      cancelText={tCommon("cancel")}
                      type="danger"
                    >
                      <Button
                        size="sm"
                        type="danger"
                        icon={<Icon icon="delete_2_line" />}
                      >
                        {tCommon("delete")}
                      </Button>
                    </Confirm>
                  ) : (
                    <div className="flex-1">
                      <Button
                        size="sm"
                        icon={<Icon icon="star_line" />}
                        onClick={onCollect}
                      >
                        {tCommon("collect")}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[50vh] flex gap-2 justify-center items-center">
            <Icon icon="warning_fill" size={18} />
            {tCommon("no-data")}
          </div>
        )}
      </Modal>
      <Create ref={createRef} />
    </>
  );
}
