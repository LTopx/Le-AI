"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/lib";

interface LPopoverProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
}

export default function LPopover({ children, title }: LPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          align="start"
          className={cn(
            "z-[2000] py-2 px-4 text-sm rounded-md shadow-md max-w-[calc(100vw-10rem)] md:max-w-xs break-words",
            "data-[state=open]:animate-fadeInUp data-[state=closed]:animate-fadeOut",
            "bg-neutral-800 text-white/90",
            "dark:bg-neutral-700 dark:text-white/90"
          )}
          sideOffset={5}
        >
          {title}
          <Popover.Arrow className="fill-neutral-800 dark:fill-neutral-700" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
