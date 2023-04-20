import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "next-i18next";
import classNames from "classnames";
import { AiOutlineClose } from "react-icons/ai";
import Button from "../Button";

export interface ModalProps extends React.PropsWithChildren {
  autoFocus?: boolean;
  footer?: React.ReactNode;
  maskClosable?: boolean;
  onClose?: () => void;
  onOk?: () => void;
  open: boolean;
  title?: React.ReactNode;
  width?: string | number;
}

const Modal: React.FC<ModalProps> = ({
  autoFocus = false,
  children,
  footer,
  maskClosable = true,
  onClose,
  onOk,
  open = false,
  title,
  width = "32.5rem",
}) => {
  const { t } = useTranslation("common");

  const onClickOverlay = () => {
    if (maskClosable) onClose?.();
  };

  const onOpenAutoFocus = (event: Event) => {
    if (!autoFocus) event.preventDefault();
  };

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={classNames(
            "bg-mask z-[1500] fixed inset-0 backdrop-blur-sm backdrop-filter",
            "data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut"
          )}
          onClick={onClickOverlay}
        />
        <div className="inset-0 fixed z-[1500]">
          <Dialog.Content
            className={classNames(
              "bg-white dark:bg-[#2a2a2b]",
              "p-5 mx-auto relative top-36 rounded-md shadow-md",
              "data-[state=open]:animate-fadeUp data-[state=closed]:animate-fadeOut"
            )}
            style={{ width, maxWidth: "calc(100vw - 2rem)" }}
            onOpenAutoFocus={onOpenAutoFocus}
            onEscapeKeyDown={onClose}
          >
            <Dialog.Title className="text-base-color dark:text-neutral-50 m-0 font-semibold text-center">
              {title || "Title"}
            </Dialog.Title>
            <div className="mt-2 mb-3">{children}</div>
            {footer !== undefined ? (
              footer
            ) : (
              <div className="flex justify-center gap-2 mt-6">
                <Button type="default" onClick={onClose}>
                  {t("cancel")}
                </Button>
                <Button type="primary" onClick={onOk}>
                  {t("ok")}
                </Button>
              </div>
            )}
            <Dialog.Close asChild>
              <button
                className={classNames(
                  "text-icon hover:text-icon-hover dark:text-neutral-50 dark:hover:text-neutral-400",
                  "absolute right-4 top-4 appearance-none h-5 w-5 transition-colors flex justify-center items-center"
                )}
                aria-label="Close"
                onClick={onClose}
              >
                <AiOutlineClose size={18} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
