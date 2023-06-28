import React from "react";
import { useTranslations } from "next-intl";
import { AiOutlineLoading, AiFillBug } from "react-icons/ai";
import type { Prompt } from "@prisma/client";
import { cn } from "@/lib";
import PromptItem from "./item";

interface IGroupProps {
  type?: string;
  list: Prompt[];
  loading?: boolean;
  onSelect?: (value: Prompt) => void;
  onEdit?: (value: Prompt) => void;
  onDelete?: (value: Prompt) => void;
  onRelease?: (value: Prompt) => void;
  onRevoke?: (value: Prompt) => void;
}

const Group: React.FC<IGroupProps> = ({
  type,
  list,
  loading,
  onSelect,
  onEdit,
  onDelete,
  onRelease,
  onRevoke,
}) => {
  const t = useTranslations("prompt");

  const onSelectPrompt = (data: Prompt) => onSelect?.(data);

  const onEditPrompt = (data: Prompt) => onEdit?.(data);

  const onDeletePrompt = (data: Prompt) => onDelete?.(data);

  const onReleasePrompt = (data: Prompt) => onRelease?.(data);

  const onRevokePrompt = (data: Prompt) => onRevoke?.(data);

  if (loading) {
    return (
      <div className="flex h-40 justify-center items-center">
        <AiOutlineLoading size={18} className="animate-spin" />
      </div>
    );
  }

  if (!list.length)
    return (
      <div className="flex h-40 text-[hsl(215.4,16.3%,56.9%)] gap-2 items-center justify-center">
        <AiFillBug size={18} />
        {t("no-data")}
      </div>
    );

  return (
    <div
      className={cn(
        "grid gap-4 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1"
      )}
    >
      {list.map((item) => (
        <PromptItem
          key={item.id}
          type={type}
          data={item}
          onSelect={onSelectPrompt}
          onEdit={onEditPrompt}
          onDelete={onDeletePrompt}
          onRelease={onReleasePrompt}
          onRevoke={onRevokePrompt}
        />
      ))}
    </div>
  );
};

export default Group;
