import * as React from "react";
import * as Select from "@radix-ui/react-select";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { BsChevronDown } from "react-icons/bs";
import { AiOutlineLoading } from "react-icons/ai";
import Item from "./item";

type OptionsChildren = {
  label: string;
  value: any;
};

type Options = {
  label: string;
  value: any;
  children?: OptionsChildren[];
};

interface LSelectProps extends React.HTMLAttributes<HTMLElement> {
  contentClassName?: string;
  options: Options[];
  loading?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

const LSelect: React.FC<LSelectProps> = ({
  className,
  contentClassName,
  placeholder,
  options,
  loading,
  onChange,
  value,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Select.Root
      value={value}
      onValueChange={onChange}
      onOpenChange={setIsOpen}
    >
      <Select.Trigger
        className={twMerge(
          clsx(
            "px-3 h-8 transition-colors rounded inline-flex text-sm items-center justify-between border border-transparent",
            "bg-gray-200/70 hover:bg-gray-200",
            "dark:bg-neutral-700/90 dark:hover:bg-zinc-600",
            { "bg-white border-sky-500": isOpen },
            { "dark:bg-transparent": isOpen },
            className
          )
        )}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="text-neutral-800 dark:text-neutral-300">
          {loading ? (
            <AiOutlineLoading size={14} className="animate-spin" />
          ) : (
            <BsChevronDown
              size={12}
              className={clsx({ "rotate-180": isOpen })}
            />
          )}
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className={clsx(
            "z-[1999] py-1 rounded border shadow-md",
            "bg-white",
            "dark:bg-neutral-700 dark:border-neutral-600",
            "data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut",
            contentClassName
          )}
        >
          <Select.Viewport>
            {options.map((item) => (
              <Select.Group key={item.value}>
                {item.children?.length ? (
                  <>
                    <Select.Label className="px-3 text-xs pt-2 text-gray-500 select-none">
                      {item.label}
                    </Select.Label>
                    {item.children.map((child) => (
                      <Item key={child.value} value={child.value}>
                        {child.label}
                      </Item>
                    ))}
                  </>
                ) : (
                  <Item value={item.value}>{item.label}</Item>
                )}
              </Select.Group>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default LSelect;
