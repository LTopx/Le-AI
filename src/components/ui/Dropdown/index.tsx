"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib";
import { BsCheck2 } from "react-icons/bs";

export interface IDropdownItems {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface IDropdownMenuProps {
  /** A ReactNode that open the AlertDialog */
  trigger: React.ReactNode;

  value?: any;

  options?: IDropdownItems[];

  onChange?: (value: any) => void;
}

const LDropdownMenu = React.forwardRef<any, IDropdownMenuProps>(
  ({ trigger, value, options, onChange }, forwardedRef) => {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={cn(
              "z-[2000] bg-white",
              "data-[state=open]:animate-fadeInUp data-[state=closed]:animate-fadeOut border rounded-lg p-1"
            )}
          >
            {options?.map((item) => (
              <DropdownMenu.Item
                key={item.value}
                onSelect={() => onChange?.(item.value)}
                className={cn(
                  "select-none cursor-pointer outline-none border-none rounded-md h-9 px-2 flex items-center text-sm transition-colors",
                  "hover:bg-neutral-200"
                )}
              >
                <div className="flex items-center gap-2">
                  <BsCheck2
                    className={cn("opacity-0", {
                      "opacity-100": item.value === value,
                    })}
                  />
                  <div className="flex gap-1">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                </div>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  }
);

LDropdownMenu.displayName = "DropdownMenu";

export default LDropdownMenu;
