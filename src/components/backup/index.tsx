import React from "react";
import { useTranslations } from "next-intl";
import { Modal } from "@ltopx/lx-ui";
import Icon from "@/components/icon";
import { useOpenStore } from "@/hooks/useOpen";
import ModalContent from "./modalContent";

export default function Backup() {
  const tGlobal = useTranslations("global");

  const [open, setOpen] = useOpenStore((state) => [
    state.backupOpen,
    state.updateBackupOpen,
  ]);

  const onClose = () => setOpen(false);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <Icon icon="cloud_fill" size={24} className="text-sky-400" />
          {tGlobal("backup-sync")}
        </div>
      }
      maskClosable={false}
      open={open}
      onClose={onClose}
      footer={null}
    >
      <ModalContent onClose={onClose} />
    </Modal>
  );
}
