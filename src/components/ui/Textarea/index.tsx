import * as React from "react";
import { cn } from "@/lib";

interface TextareaProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  value?: any;
  disabled?: boolean;
  maxLength?: number;
  onChange?: (value: any) => void;
  onEnter?: (value: any) => void;
}

const Textarea = React.forwardRef<any, TextareaProps>(
  (
    { value, disabled, className, placeholder, maxLength, onChange },
    forwardedRef
  ) => {
    const [isFocus, setIsFocus] = React.useState<boolean>(false);

    const onChangeValue = (e: any) => {
      const value = e.target.value;
      onChange?.(value);
    };

    return (
      <div
        className={cn(
          "border group border-transparent w-full inline-flex items-center rounded-md overflow-hidden transition-colors text-sm px-3",
          "bg-gray-200/70 hover:bg-gray-200",
          "dark:bg-neutral-700/90 dark:hover:bg-zinc-600",
          {
            "border-sky-500 bg-white hover:bg-white": isFocus,
          },
          {
            "dark:border-sky-400 dark:bg-transparent dark:hover:bg-transparent":
              isFocus,
          },
          {
            "cursor-not-allowed hover:bg-gray-200/70 dark:hover:bg-neutral-700/90":
              disabled,
          },
          className
        )}
      >
        <textarea
          className={cn(
            "w-full resize-none bg-transparent appearance-none outline-none leading-[1.375rem]",
            { "cursor-not-allowed text-black/30 dark:text-white/30": disabled }
          )}
          rows={4}
          maxLength={maxLength}
          disabled={disabled}
          placeholder={placeholder}
          defaultValue={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={onChangeValue}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
