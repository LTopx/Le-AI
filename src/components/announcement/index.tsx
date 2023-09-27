"use client";

import React from "react";
import { Modal, Button } from "@ltopx/lx-ui";
import { useTranslations } from "next-intl";
import pkg from "../../../package.json";

export default function Announcement() {
  const tGlobal = useTranslations("global");
  const tZLog = useTranslations("zLog");

  const [open, setOpen] = React.useState(false);

  const onClose = () => {
    localStorage.setItem("announcement_version", pkg.version);
    setOpen(false);
  };

  React.useEffect(() => {
    const announcement_version = localStorage.getItem("announcement_version");
    if (pkg.version !== announcement_version) setOpen(true);
  }, []);

  return (
    <Modal
      width={700}
      title={tZLog("title")}
      maskClosable={false}
      open={open}
      onClose={onClose}
      footer={
        <div className="flex justify-end">
          <Button type="primary" onClick={onClose}>
            {tGlobal("ok-spacing")}
          </Button>
        </div>
      }
    >
      <div className="max-h-[500px] overflow-y-auto">
        <div className="flex">
          <Button
            type="link"
            target="_blank"
            href="https://docs.le-ai.app/change-log"
          >
            {tZLog("full-log")}
          </Button>
        </div>
        <ul
          role="list"
          className="list-disc space-y-3 mt-3 max-h-[500px] pl-5 text-slate-500 overflow-y-auto marker:text-sky-400"
        >
          <li>{tZLog("text1")}</li>
          <li>{tZLog("text2")}</li>
          <li>{tZLog("text3")}</li>
        </ul>
      </div>
    </Modal>
  );
}
