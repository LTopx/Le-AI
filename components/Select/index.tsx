import * as React from "react";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";

interface SelectItemProps extends React.PropsWithChildren {
  className?: string | undefined;
  value: any;
  disabled?: boolean;
}

type Options = {
  label: string;
  value: any;
};

export interface SelectProps {
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  onChange?: (value: any) => void;
  options: Options[];
  placeholder?: string;
  value?: any;
}

const LSelect: React.FC<SelectProps> = ({
  className,
  contentClassName,
  disabled = false,
  onChange,
  options,
  placeholder,
  value,
}) => {
  const triggerRef = React.useRef<any>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Select.Root
      value={value}
      onValueChange={onChange}
      onOpenChange={setIsOpen}
    >
      <Select.Trigger
        ref={triggerRef}
        disabled={disabled}
        className={classnames(
          "w-40 px-3 h-8 inline-flex items-center justify-between",
          "rounded text-sm leading-none outline-none border border-transparent",
          "bg-[#f2f3f5] hover:bg-[#e5e6eb] text-neutral-950 shadow-sm transition-colors",
          "dark:bg-[#383838] dark:hover:bg-[#434343] dark:text-color-text-1",
          "data-[state=open]:bg-white data-[state=open]:border-sky-600 dark:data-[state=open]:bg-[#232323]",
          { "dark:!text-neutral-400": value === undefined },
          className
        )}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="text-neutral-800 dark:text-color-text-2">
          <BsChevronDown
            size={12}
            className={classnames({ "rotate-180": isOpen })}
          />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={3}
          className={classnames(
            "z-[1999] overflow-hidden bg-white rounded-md shadow-2xl border border-neutral-300 w-40",
            "dark:border-color-fill-3 dark:bg-color-bg-5",
            "data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut",
            contentClassName
          )}
        >
          <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
            <AiOutlineUp />
          </Select.ScrollUpButton>
          <Select.Viewport className="py-1">
            {options.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
            <AiOutlineDown />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectItem = React.forwardRef<any, SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={classnames(
          "h-9 cursor-pointer px-3 flex items-center text-sm outline-none",
          "dark:text-color-text-1 dark:hover:bg-color-fill-2 dark:data-[state=checked]:bg-color-fill-2",
          "text-neutral-900 hover:bg-neutral-100 transition-colors data-[state=checked]:bg-neutral-200 data-[state=checked]:font-medium",
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

export default LSelect;
