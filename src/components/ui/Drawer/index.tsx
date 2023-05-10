"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { AiOutlineClose } from "react-icons/ai";

interface DrawerProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** The Drawer is open or not */
  open?: boolean;

  /** Dialog.Overlay custom className */
  overlayClassName?: string | undefined;

  /** The Drawer's Title */
  title?: React.ReactNode;

  /** Width of the Drawer, default is 378px */
  width?: number | string;

  /** Need autofocus or noe */
  autoFocus?: boolean;

  /** Specify a function that will be called when the drawer close */
  onClose?: () => void;
}

const Drawer = React.forwardRef<any, DrawerProps>(
  (
    {
      children,
      className,
      open,
      overlayClassName,
      title,
      width = 378,
      autoFocus = false,
      onClose,
    },
    forwardedRef
  ) => {
    const onOpenChange = (open: boolean) => {
      if (!open) onClose?.();
    };

    const onOpenAutoFocus = (event: Event) => {
      if (!autoFocus) event.preventDefault();
    };

    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay
            className={clsx(
              "bg-gray-900/40 backdrop-blur-sm fixed inset-0 z-[1500]",
              "data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut",
              overlayClassName
            )}
          />
          <Dialog.Content
            className={clsx(
              "fixed top-0 bottom-0 h-full w-20 z-[1500] max-w-[calc(100vw-2rem)]",
              "data-[state=open]:animate-showLeft data-[state=closed]:animate-hideLeft",
              "bg-white/90 backdrop-blur-sm",
              "dark:bg-slate-800/90",
              className
            )}
            style={{ width }}
            onOpenAutoFocus={onOpenAutoFocus}
          >
            <Dialog.Title
              className={clsx(
                "h-14 px-4 flex items-center text-lg font-medium leading-6",
                "text-gray-900",
                "dark:text-white/90"
              )}
            >
              {title || "Title"}
            </Dialog.Title>
            {children}
            <Dialog.Close asChild>
              <button
                className={clsx(
                  "outline-none transition-colors absolute h-14 w-14 flex justify-center items-center top-0 right-0",
                  "text-black/40 hover:text-black/90",
                  "dark:text-white/40 dark:hover:text-white/90"
                )}
              >
                <AiOutlineClose size={18} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
);

Drawer.displayName = "Drawer";

export default Drawer;
