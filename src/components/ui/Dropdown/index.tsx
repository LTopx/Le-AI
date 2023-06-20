"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib";
import { BsCheck2 } from "react-icons/bs";

export interface IDropdownItems {
  label?: React.ReactNode;
  value?: string;
  icon?: React.ReactNode;
  type?: string;
}

interface IDropdownMenuProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "content"> {
  /** A ReactNode that open the AlertDialog */
  trigger: React.ReactNode;

  disabled?: boolean;

  align?: "start" | "center" | "end";

  alignOffset?: number;

  sideOffset?: number;

  /** support selection */
  selectable?: boolean;

  content?: React.ReactNode;

  options?: IDropdownItems[];

  value?: any;

  onSelect?: (value: any) => void;
}

const LDropdownMenu = React.forwardRef<any, IDropdownMenuProps>(
  (
    {
      className,
      trigger,
      disabled,
      align = "center",
      alignOffset,
      sideOffset,
      selectable = false,
      content,
      options,
      value,
      onSelect,
    },
    forwardedRef
  ) => {
    const [open, setOpen] = React.useState(false);

    const onOpenChange = (isOpen: boolean) => {
      if (disabled) return setOpen(false);
      setOpen(isOpen);
    };

    return (
      <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
        <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align={align}
            alignOffset={alignOffset}
            sideOffset={sideOffset}
            className={cn(
              "z-[2000] bg-white border rounded-lg p-1",
              "data-[side=top]:animate-fadeInUp data-[side=bottom]:animate-fadeInDown data-[state=closed]:animate-fadeOut",
              "dark:bg-slate-800 dark:border-slate-200/30",
              className
            )}
          >
            {!!content && (
              <DropdownMenu.Label className="mb-1">
                {content}
              </DropdownMenu.Label>
            )}
            {options?.map((item) =>
              item.type === "seperate" ? (
                <DropdownMenu.Separator
                  key={item.value}
                  className="h-[1px] my-1 bg-neutral-200 dark:bg-neutral-600"
                />
              ) : (
                <DropdownMenu.Item
                  key={item.value}
                  onSelect={() => onSelect?.(item.value)}
                  className={cn(
                    "select-none cursor-pointer outline-none border-none rounded-md h-8 px-2 flex items-center text-sm transition-colors",
                    "bg-white hover:bg-neutral-200",
                    "dark:bg-slate-800 dark:hover:bg-slate-700/70"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {!!selectable && (
                      <BsCheck2
                        className={cn("opacity-0", {
                          "opacity-100": item.value === value,
                        })}
                      />
                    )}
                    <div className="flex gap-2 items-center">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  </div>
                </DropdownMenu.Item>
              )
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  }
);

LDropdownMenu.displayName = "DropdownMenu";

export default LDropdownMenu;
