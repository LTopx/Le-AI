import React from "react";
import { useDateFormat } from "l-hooks";
import { useTranslations } from "next-intl";
import type { Prompt } from "@prisma/client";
import Icon from "@/components/icon";
import { Button, Dropdown, Divider } from "@/components/ui";
import type { IDropdownItems } from "@/components/ui/Dropdown";
import MenuIcon from "@/components/menu/icon";
import type { ChannelIcon } from "@/hooks";
import { cn } from "@/lib";

interface Props {
  type?: string;
  data: Prompt;
  onSelect: (value: Prompt) => void;
  onEdit: (value: Prompt) => void;
  onDelete: (value: Prompt) => void;
  onRelease: (value: Prompt) => void;
  onRevoke?: (value: Prompt) => void;
}

const PromptItem: React.FC<Props> = ({
  type,
  data,
  onSelect,
  onEdit,
  onDelete,
  onRelease,
  onRevoke,
}) => {
  const t = useTranslations("prompt");
  const { format } = useDateFormat();

  const [lanType, setLanType] = React.useState<"cn" | "en">("cn");

  const handleMenuOptions: IDropdownItems[] = [
    {
      label: t("apply"),
      value: "apply",
      icon: <Icon icon="check_2_fill" />,
    },
    {
      label: t("edit"),
      value: "edit",
      icon: <Icon icon="pencil_2_line" />,
    },
    {
      label: t("release"),
      value: "release",
      icon: <Icon icon="align_arrow_up_line" />,
    },
    {
      label: t("delete"),
      value: "delete",
      icon: <Icon icon="delete_2_line" />,
    },
  ];

  const content: any = data.content;

  const onToggleLan = () => {
    setLanType(lanType === "cn" ? "en" : "cn");
  };

  const onSelectMenu = (type: string) => {
    if (type === "delete") {
      onDelete(data);
    } else if (type === "edit") {
      onEdit(data);
    } else if (type === "apply") {
      onSelect(data);
    } else if (type === "release") {
      onRelease(data);
    }
  };

  const onHandleRevoke = () => onRevoke?.(data);

  const onUse = () => onSelect(data);

  React.useEffect(() => {
    if ((data.content as any)?.cn) {
      setLanType("cn");
    } else {
      setLanType("en");
    }
  }, []);

  return (
    <div
      className={cn(
        "select-none py-3 px-4 rounded-md text-sm cursor-pointer border transition-all relative",
        "text-neutral-800 dark:text-neutral-100",
        "shadow-[0_2px_4px_rgba(0,0,0,.04)]",
        "border-[rgba(0,0,0,.08)] dark:border-[rgba(255,255,255,.3)]",
        "bg-white hover:bg-neutral-50 dark:hover:bg-neutral-800/40",
        "dark:bg-neutral-800/60 dark:hover:bg-neutral-700/40",
        "active:bg-[rgb(239,239,239)]"
      )}
    >
      <div className="flex flex-col">
        <div className="font-semibold text-base text-ellipsis pl-6 pr-2 overflow-hidden whitespace-nowrap relative">
          <MenuIcon name={data.icon as ChannelIcon} />
          {data.title}
        </div>
        <Divider className="my-2" />
        <div className="h-10 text-ellipsis overflow-hidden line-clamp-2">
          {data.desc}
        </div>
        <div className="h-24 mt-3 mb-4 overflow-y-auto">
          {content?.[lanType]}
        </div>
        <div className="flex text-xs gap-2 justify-between items-center font-medium">
          {type === "custom" ? (
            <div />
          ) : (
            <div>
              {data.creatorName !== "system"
                ? "@" + data.creatorName
                : data.creatorName}
            </div>
          )}
          <div>{format(data.updatedAt as any, "YYYY-MM-DD")}</div>
        </div>
        <div className="flex mt-2 justify-end">
          {type === "custom" && (
            <Dropdown
              className="min-w-[7rem]"
              align="end"
              sideOffset={6}
              trigger={
                <div>
                  <Button size="xs" type="primary">
                    <Icon icon="list_expansion_fill" />
                  </Button>
                </div>
              }
              options={handleMenuOptions}
              onSelect={onSelectMenu}
            />
          )}
          {type === "review" && (
            <Button size="xs" type="danger" onClick={onHandleRevoke}>
              {t("revoke")}
            </Button>
          )}
          {type !== "custom" && type !== "review" && (
            <Button size="xs" type="primary" onClick={onUse}>
              {t("apply")}
            </Button>
          )}
        </div>
      </div>
      {content?.cn && content?.en && (
        <Icon
          icon="translate_line"
          size={20}
          className="absolute right-2 top-2 text-sky-400"
          onClick={onToggleLan}
        />
      )}
    </div>
  );
};

export default PromptItem;
