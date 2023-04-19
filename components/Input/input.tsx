import * as React from "react";
import classNames from "classnames";

export interface InputProps {
  className?: string;
  maxLength?: number;
  onChange: (value: any) => void;
  value: any;
}

export interface InputRef {
  focus: () => void;
  blur: () => void;
}

const Input = React.forwardRef<InputRef, InputProps>(
  ({ className, maxLength, onChange, value }, forwardedRef) => {
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
          "bg-white border rounded-md transition-colors inline-block relative hover:border-[#4096ff]",
          {
            "border-[#4096ff] shadow-[0_0_0_2px_rgba(5,145,255,.1)]": isFocus,
          },
          className
        )}
      >
        <input
          type="text"
          className="bg-transparent text-black rounded-md h-8 outline-none text-sm w-full py-1 px-3 block"
          ref={inputRef}
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
