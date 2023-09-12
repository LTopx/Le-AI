"use client";

import React from "react";
import Image from "next/image";
import { Modal, Button } from "@ltopx/lx-ui";
import { useTranslations, useLocale } from "next-intl";
import pkg from "../../../package.json";

export default function Announcement() {
  const tGlobal = useTranslations("global");
  const tZLog = useTranslations("zLog");

  const locale = useLocale();

  const [open, setOpen] = React.useState(false);

  const url =
    locale === "zh-CN" ? "/changelog/zh-CN.webp" : "/changelog/en.webp";

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
        <Image src={url} alt="" width={1920} height={300} />
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
          <li>
            {tZLog("text2")},{" "}
            <a
              href="https://docs.le-ai.app/client"
              target="_blank"
              className="text-sky-400 hover:underline"
            >
              {tGlobal("learn-more")}
            </a>
          </li>
          <li>{tZLog("text3")}</li>
          <li>{tZLog("text4")}</li>
          <li>{tZLog("text5")}</li>
        </ul>
      </div>
    </Modal>
  );
}
