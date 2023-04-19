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
            "bg-black/40 z-[1500] fixed inset-0",
            "data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut"
          )}
          onClick={stopPropagation}
        />
        <div className="inset-0 fixed z-[1500]" onClick={stopPropagation}>
          <AlertDialog.Content
            className={classNames(
              "bg-white w-confirm-modal max-w-confirm-modal p-5 mx-auto relative top-36 rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]",
              "data-[state=open]:animate-fadeUp data-[state=closed]:animate-fadeOut"
            )}
          >
            <div className="flex gap-3">
              <div>
                <AiFillExclamationCircle className="text-[#faad14]" size={22} />
              </div>
              <div>
                <AlertDialog.Title className="text-base-color m-0 font-semibold">
                  {title || "Title"}
                </AlertDialog.Title>
                <AlertDialog.Description className="text-base-color mt-2 mb-3 text-sm">
                  {content}
                </AlertDialog.Description>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <AlertDialog.Cancel asChild>
                <Button type="default" onClick={stopPropagation}>
                  {t("cancel")}
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button type="primary" onClick={onClickOk}>
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
