"use client";

import React from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Modal, Button, Link } from "@/components/ui";
import pkg from "../../../package.json";

export default function Announcement() {
  const locale = useLocale();
  const t = useTranslations("zLog");
  const tCommon = useTranslations("common");

  const [open, setOpen] = React.useState(false);

  const url =
    locale === "zh-CN"
      ? "https://docs.ltopx.com/zh-CN/change-log"
      : "https://docs.ltopx.com/change-log";

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
      rootClassName="top-[50%]"
      width={700}
      title={t("title")}
      maskClosable={false}
      open={open}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button type="primary" onClick={onClose}>
            {tCommon("ok")}
          </Button>
        </div>
      }
    >
      <Link target="_blank" href={url}>
        {t("full-log")}
      </Link>
      <ul
        role="list"
        className="marker:text-sky-400 mt-3 list-disc pl-5 space-y-3 text-slate-500 max-h-[500px] overflow-y-auto"
      >
        <li>{t("text1")}</li>
        <div>
          <Image src="/change_1.jpg" alt="" width={400} height={400} />
        </div>
        <li>{t("text2")}</li>
        <div>
          <Image src="/change_2.jpg" alt="" width={400} height={400} />
        </div>
        <li>{t("text3")}</li>
        <div>
          <Image src="/change_3.jpg" alt="" width={400} height={400} />
        </div>
      </ul>
    </Modal>
  );
}
