import React from "react";
import * as Select from "@radix-ui/react-select";
import { cn } from "@/lib";

interface SelectItemProps extends React.PropsWithChildren {
  className?: string | undefined;
  value: any;
  disabled?: boolean;
}

const SelectItem = React.forwardRef<any, SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    const { disabled } = props;
    return (
      <Select.Item
        className={cn(
          "h-9 cursor-pointer px-3 flex items-center text-sm outline-none transition-colors",
          "text-black/80 hover:bg-gray-100 data-[state=checked]:bg-gray-100 data-[state=checked]:font-medium",
          "dark:text-white/90 dark:hover:bg-neutral-600 dark:data-[state=checked]:bg-neutral-600",
          { "cursor-default text-gray-400/70 dark:text-gray-500": !!disabled },
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
      </Select.Item>
    );
  }
);

SelectItem.displayName = "SelectItem";

export default SelectItem;
