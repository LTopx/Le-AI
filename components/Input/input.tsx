import * as React from "react";
import classNames from "classnames";

type HTMLInputTypeAttribute =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week"
  | (string & {});

export interface InputProps {
  className?: string;
  maxLength?: number;
  onChange: (value: any) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value: any;
}

export interface InputRef {
  focus: () => void;
  blur: () => void;
}

const Input = React.forwardRef<InputRef, InputProps>(
  (
    { className, maxLength, onChange, placeholder, type = "text", value },
    forwardedRef
  ) => {
    const inputRef = React.useRef<any>(null);

    const [isFocus, setIsFocus] = React.useState<boolean>(false);

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
        className={classNames(
          "px-3 border border-transparent",
          "bg-[#f2f3f5] hover:bg-[#e5e6eb] rounded transition-colors",
          "dark:bg-[#383838] dark:text-color-text-1 dark:hover:bg-[#434343]",
          { "!border-sky-600 !bg-white dark:!bg-[#232323]": isFocus },
          className
        )}
      >
        <input
          className="outline-none appearance-none rounded text-sm bg-transparent py-1 w-full leading-[1.5715]"
          type={type}
          ref={inputRef}
          placeholder={placeholder}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
