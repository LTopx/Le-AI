import * as React from "react";
import classNames from "classnames";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useTranslation } from "next-i18next";
import { AiFillExclamationCircle } from "react-icons/ai";
import Button from "../Button";

export interface ConfirmProps {
  content?: React.ReactNode;
  onOk?: () => void;
  title?: React.ReactNode;
  trigger: React.ReactNode;
}

const Confirm: React.FC<ConfirmProps> = ({ content, onOk, title, trigger }) => {
  const { t } = useTranslation("common");

  const stopPropagation = (e: any) => e.stopPropagation();

  const onClickOk = (e: any) => {
    e.stopPropagation();
    onOk?.();
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          className={classNames(
            "bg-mask z-[1500] fixed inset-0",
            "data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut"
          )}
          onClick={stopPropagation}
        />
        <div className="inset-0 fixed z-[1500]" onClick={stopPropagation}>
          <AlertDialog.Content
            className={classNames(
              "w-confirm-modal max-w-confirm-modal p-5 mx-auto relative top-36 rounded-md shadow-md",
              "bg-white dark:bg-[#2a2a2b]",
              "data-[state=open]:animate-fadeUp data-[state=closed]:animate-fadeOut"
            )}
          >
            <div className="flex flex-col">
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2">
                  <AiFillExclamationCircle
                    className="text-[#faad14]"
                    size={20}
                  />
                  <AlertDialog.Title className="text-base-color dark:text-color-text-1 m-0 font-medium">
                    {title || "Title"}
                  </AlertDialog.Title>
                </div>
              </div>
              <div>
                <AlertDialog.Description className="text-base-color dark:text-color-text-1 text-sm">
                  {content}
                </AlertDialog.Description>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-8">
              <AlertDialog.Cancel asChild>
                <Button type="default" onClick={stopPropagation}>
                  {t("cancel")}
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button type="danger" onClick={onClickOk}>
                  {t("ok")}
                </Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </div>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default Confirm;
