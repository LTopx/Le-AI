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
          "bg-white hover:border-sky-400 flex-1 border rounded-md transition-colors relative pr-5",
          "dark:bg-neutral-900/90 dark:border-neutral-700 dark:backdrop-blur-sm",
          {
            "border-sky-400 dark:border-sky-400/90 shadow": isFocus,
          },
          className
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
          <div
            className={classNames(
              "rounded-md cursor-pointer flex h-7 transition-colors right-2.5 bottom-2 w-7 absolute justify-center items-center",
              "text-sky-400 hover:bg-[#e3e5e5]",
              "dark:text-sky-400/90"
            )}
          >
            <AiOutlineLoading size={24} className="animate-spin" />
          </div>
        ) : (
          <div
            onClick={onSubmit}
            className={classNames(
              "rounded-md cursor-pointer flex h-7 transition-colors right-2.5 bottom-2 w-7 absolute justify-center items-center",
              "text-gray-400/70 dark:text-neutral-500",
              "hover:bg-gray-200 dark:hover:bg-neutral-700/80",
              { "text-sky-400 dark:text-sky-400/90": value }
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
