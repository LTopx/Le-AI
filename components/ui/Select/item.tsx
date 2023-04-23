import * as React from "react";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";

interface SelectItemProps extends React.PropsWithChildren {
  className?: string | undefined;
  value: any;
  disabled?: boolean;
}

const SelectItem = React.forwardRef<any, SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={classnames(
          "h-9 cursor-pointer px-3 flex items-center text-sm outline-none transition-colors",
          "text-black/80 hover:bg-gray-100 data-[state=checked]:bg-gray-100 data-[state=checked]:font-medium",
          "dark:text-white/90 dark:hover:bg-neutral-600 dark:data-[state=checked]:bg-neutral-600",
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
