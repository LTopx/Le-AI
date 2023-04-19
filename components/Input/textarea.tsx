import * as React from "react";
import { useTranslation } from "next-i18next";
import classNames from "classnames";
import { AiOutlineSend, AiOutlineLoading } from "react-icons/ai";
import { useChatLoading } from "@/state";

export interface TextAreaProps {
  className?: string | undefined;
  onChange: (value: any) => void;
  onSubmit: () => void;
  value: any;
}

export interface TextAreaRef {
  blur: () => void;
  focus: () => void;
  reset: () => void;
}

const TextArea = React.forwardRef<TextAreaRef, TextAreaProps>(
  ({ className, value, onChange, onSubmit }, forwardedRef) => {
    const { t } = useTranslation("chat");

    // data
    const [isFocus, setIsFocus] = React.useState<boolean>(false);
    const loadingFinish = useChatLoading(
      (state) => state.loadingResponseFinish
    );

    // ref
    const inputRef = React.useRef<any>(null);

    const placeholder = t("type-message");

    const onInput = () => {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
      inputRef.current.style.overflow =
        inputRef.current.getBoundingClientRect().height ===
        inputRef.current.scrollHeight
          ? "hidden"
          : "auto";
    };

    const onKeyDown = (e: any) => {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    };

    React.useImperativeHandle(forwardedRef, () => ({
      focus() {
        inputRef.current?.focus();
      },
      blur() {
        inputRef.current?.blur();
      },
      reset() {
        inputRef.current.value = "";
        onInput();
      },
    }));

    return (
      <div
        className={classNames(
          className,
          "flex-1 bg-white dark:bg-neutral-900 border dark:border-neutral-700 rounded-md transition-colors relative hover:border-[#4096ff] pr-5",
          {
            "border-[#4096ff] dark:border-sky-700 shadow-[0_0_0_2px_rgba(5,145,255,.1)]":
              isFocus,
          }
        )}
      >
        <textarea
          className="bg-transparent rounded-md h-full outline-none text-sm w-full max-h-56 py-3 px-4 resize-none block"
          ref={inputRef}
          placeholder={placeholder}
          rows={1}
          onInput={onInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onKeyDown={onKeyDown}
        />
        {loadingFinish ? (
          <div className="rounded-md text-primary cursor-pointer flex h-7 transition-colors right-2.5 bottom-2 w-7 absolute justify-center items-center hover:bg-[#e3e5e5]">
            <AiOutlineLoading size={24} className="animate-spin" />
          </div>
        ) : (
          <div
            onClick={onSubmit}
            className={classNames(
              "rounded-md cursor-pointer text-disabled dark:text-neutral-500 flex h-7 transition-colors right-2.5 bottom-2 w-7 absolute justify-center items-center hover:bg-[#e3e5e5] dark:hover:bg-neutral-800",
              value ? "!text-primary" : ""
            )}
          >
            <AiOutlineSend size={24} />
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
