import React from "react";
import { useTranslations } from "next-intl";
import { useConfigStore } from "@/hooks/useConfig";
import { isMobile, getPlatform, cn } from "@/lib";
import Icon from "@/components/icon";
import { Loader2 } from "lucide-react";

export interface ChatInputProps {
  className?: string | undefined;
  loading?: boolean;
  onChange: (value: any) => void;
  onSubmit: () => void;
  value: any;
}

export interface ChatInputRef {
  blur: () => void;
  focus: () => void;
  reset: () => void;
}

const ChatInput = React.forwardRef<ChatInputRef, ChatInputProps>(
  ({ className, loading, value, onChange, onSubmit }, forwardedRef) => {
    const tGlobal = useTranslations("global");
    const sendMessageType = useConfigStore((state) => state.sendMessageType);

    // data
    const [isFocus, setIsFocus] = React.useState<boolean>(false);

    // ref
    const inputRef = React.useRef<any>(null);

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
      const isMobileDevice = isMobile();
      const platform = getPlatform();

      if (isMobileDevice) {
        if (sendMessageType === "Enter") {
          if (e.keyCode === 13) {
            e.preventDefault();
            onSubmit();
          }
        }
      } else {
        // We need to differentiate between Windows and Mac.
        if (sendMessageType === "Enter") {
          if (platform === "mac") {
            if (e.keyCode === 13 && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          } else if (platform === "windows") {
            if ((e.keyCode === 13 || e.keyCode === 10) && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }
        } else if (sendMessageType === "CommandEnter") {
          if (platform === "mac") {
            if (e.keyCode === 13 && e.metaKey) {
              e.preventDefault();
              onSubmit();
            }
          } else if (platform === "windows") {
            if ((e.keyCode === 13 || e.keyCode === 10) && e.ctrlKey) {
              e.preventDefault();
              onSubmit();
            }
          }
        }
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
        className={cn(
          "bg-white hover:border-sky-400 flex-1 border rounded-xl transition-colors relative pr-5",
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
          placeholder={tGlobal("type-message")}
          rows={1}
          onInput={onInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onKeyDown={onKeyDown}
        />
        {!!loading ? (
          <div
            className={cn(
              "rounded-md cursor-pointer flex h-7 transition-colors right-2.5 bottom-2 w-7 absolute justify-center items-center",
              "text-sky-400 hover:bg-[#e3e5e5]",
              "dark:text-sky-400/90"
            )}
          >
            <Loader2 className="h-6 w-6 animate-spin text-sky-400 dark:text-sky-400/90" />
          </div>
        ) : (
          <div
            onClick={onSubmit}
            className={cn(
              "rounded-md cursor-pointer flex h-7 transition-colors right-2.5 bottom-2 w-7 absolute justify-center items-center",
              "text-gray-400/70 dark:text-neutral-500",
              "hover:bg-gray-200 dark:hover:bg-neutral-700/80",
              { "text-sky-400 dark:text-sky-400/90": value }
            )}
          >
            <Icon icon="send_line" size={24} />
          </div>
        )}
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";

export default ChatInput;
