import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import classNames from "classnames";
import { AiOutlineClose } from "react-icons/ai";
import { useTranslation } from "next-i18next";
import { Button } from "@/components";

interface ModalProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** The Drawer is open or not */
  open?: boolean;

  /** Width of the Drawer, default is 520px */
  width?: number | string;

  /** Need autofocus or noe */
  autoFocus?: boolean;

  /** Whether to close the Alert dialog when the Overlay is clicked. default is true */
  maskClosable?: boolean;

  /** The Drawer's Title */
  title?: React.ReactNode;

  /** The Drawer's Footer */
  footer?: React.ReactNode | null;

  /** Specify a function that will be called when a user clicks mask, close button on top right or Cancel button */
  onClose?: () => void;

  /** Specify a function that will be called when a user clicks the OK button */
  onOk?: () => void;
}

const Modal = React.forwardRef<any, ModalProps>(
  (
    {
      children,
      className,
      open,
      width = "32.5rem",
      autoFocus = false,
      maskClosable = true,
      title,
      footer,
      onClose,
      onOk,
    },
    forwardedRef
  ) => {
    const { t } = useTranslation("common");

    const onOpenChange = (open: boolean) => {
      if (!open) onClose?.();
    };

    const onOpenAutoFocus = (event: Event) => {
      if (!autoFocus) event.preventDefault();
    };

    const onInteractOutside = (event: any) => {
      if (maskClosable) {
        onClose?.();
      } else {
        event.preventDefault();
      }
    };

    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay
            className={classNames(
              "bg-gray-900/40 backdrop-blur-sm fixed inset-0 z-[1500]",
              "data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut"
            )}
          />
          <div className="fixed top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[1500]">
            <Dialog.Content
              className={classNames(
                "p-6 shadow rounded-md max-w-confirm-modal relative",
                "data-[state=open]:animate-fadeUp data-[state=closed]:animate-fadeOut",
                "bg-white",
                "dark:bg-slate-800 dark:border dark:border-neutral-700/30",
                className
              )}
              style={{ width }}
              onOpenAutoFocus={onOpenAutoFocus}
              onInteractOutside={onInteractOutside}
            >
              <Dialog.Title
                className={classNames(
                  "flex items-center gap-1.5 text-lg font-medium leading-6",
                  "text-gray-900",
                  "dark:text-white/90"
                )}
              >
                {title || "Title"}
              </Dialog.Title>
              <div className="mt-2 mb-4">{children}</div>
              {footer !== undefined ? (
                footer
              ) : (
                <div className="flex justify-end gap-2">
                  <Button onClick={onClose}>{t("cancel")}</Button>
                  <Button type="primary" onClick={onOk}>
                    {t("ok")}
                  </Button>
                </div>
              )}
              <Dialog.Close asChild>
                <button
                  className={classNames(
                    "absolute right-2 top-2 w-7 h-7 flex items-center justify-center transition-colors",
                    "text-black/40 hover:text-black/90",
                    "dark:text-white/40 dark:hover:text-white/90"
                  )}
                >
                  <AiOutlineClose size={18} />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
);

Modal.displayName = "Modal";

export default Modal;
