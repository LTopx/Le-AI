import * as React from "react";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";
import { AiOutlineClose } from "react-icons/ai";
import { isUndefined } from "@/utils";

type InputType = "text" | "password" | "number";

interface InputProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  type?: InputType;
  value: any;
  allowClear?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  step?: number;
  onChange?: (value: any) => void;
}

const Input = React.forwardRef<any, InputProps>(
  (
    {
      className,
      type = "text",
      placeholder,
      value,
      allowClear,
      min,
      max,
      maxLength,
      step,
      onChange,
    },
    forwardedRef
  ) => {
    const inputRef = React.useRef<any>(null);
    const forceUpdate = React.useRef(false);

    const [isFocus, setIsFocus] = React.useState<boolean>(false);

    const onClear = () => {
      forceUpdate.current = false;
      onChange?.("");
      inputRef.current?.focus();
    };

    const onBlur = (event: any) => {
      if (type === "number") {
        const value = Number(event.target.value);
        if (max && value > max) {
          onChange?.(max);
          inputRef.current.value = max;
        } else if (min && value < min) {
          onChange?.(min);
          inputRef.current.value = min;
        } else if (!isUndefined(step) && step > 0) {
          const stepValue = Math.round(value / step) * step;
          onChange?.(stepValue);
          inputRef.current.value = stepValue;
        } else {
          onChange?.(event.target.value);
        }
      }
      setIsFocus(false);
      event.preventDefault();
      setTimeout(() => {
        if (forceUpdate.current) inputRef.current?.focus();
      }, 0);
    };

    const onChangeValue = (e: any) => {
      if (!isUndefined(min) || !isUndefined(max)) return;
      const value = e.target.value;
      onChange?.(value);
    };

    const onMouseEnter = () => {
      forceUpdate.current = true;
    };

    const onMouseLeave = () => {
      forceUpdate.current = false;
    };

    React.useImperativeHandle(forwardedRef, () => ({
      focus() {
        inputRef.current?.focus();
      },
      blur() {
        inputRef.current?.blur();
      },
    }));

    return (
      <div
        className={twMerge(
          classNames(
            "border group border-transparent w-full inline-flex items-center rounded overflow-hidden transition-colors text-sm py-1 px-3",
            "bg-gray-200/70 hover:bg-gray-200",
            "dark:bg-neutral-700/90 dark:hover:bg-zinc-600",
            {
              "border-sky-500 bg-white hover:bg-white": isFocus,
            },
            {
              "dark:border-sky-400 dark:bg-transparent dark:hover:bg-transparent":
                isFocus,
            },
            className
          )
        )}
      >
        <input
          className="w-full bg-transparent appearance-none outline-none leading-[1.375rem]"
          type={type}
          max={max}
          ref={inputRef}
          placeholder={placeholder}
          maxLength={maxLength}
          onFocus={() => setIsFocus(true)}
          onBlur={onBlur}
          // value={value}
          defaultValue={value}
          // onChange={(e) => onChange?.(e.target.value)}
          onChange={onChangeValue}
        />
        {!!value && allowClear && (
          <span
            onClick={onClear}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={classNames(
              "relative text-gray-800 hover:before:bg-gray-400/40",
              "opacity-0 group-hover:opacity-100",
              "before:h-[1.25rem] before:w-[1.25rem] before:left-[50%] before:top-[50%] before:translate-x-[-50%] before:translate-y-[-50%]",
              "before:block before:absolute before:transition-colors before:rounded-full before:cursor-pointer",
              "dark:text-white/90 dark:hover:before:bg-white/20"
            )}
          >
            <AiOutlineClose className="z-10" size={12} />
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
