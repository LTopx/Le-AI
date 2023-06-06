"use client";

import * as React from "react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { cn } from "@/lib";

export interface ContextMenuOption {
  label: string;
  value: any;
  icon?: React.ReactNode;
}

interface ContextMenuProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  options: ContextMenuOption[];
  onSelect?: (item: ContextMenuOption) => void;
}

const LContextMenu: React.FC<ContextMenuProps> = ({
  children,
  options,
  onSelect,
}) => {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content
          className={cn(
            "w-32 rounded-md border overflow-hidden shadow-lg p-1",
            "bg-white",
            "dark:bg-slate-700"
          )}
        >
          {options.map((item) => (
            <ContextMenu.Item
              asChild
              key={item.value}
              onSelect={() => onSelect?.(item)}
            >
              <div
                className={cn(
                  "outline-none rounded-md pl-2 text-sm transition-colors h-8 flex items-center gap-2 cursor-pointer",
                  "text-black/80 hover:bg-neutral-200",
                  "dark:text-white/70 dark:hover:bg-slate-600/80"
                )}
              >
                {item.icon}
                {item.label}
              </div>
            </ContextMenu.Item>
          ))}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

export default LContextMenu;
