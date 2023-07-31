"use client";

import React from "react";
import Image from "next/image";
import { Modal, Button } from "@ltopx/lx-ui";
import { useTranslations } from "next-intl";
import pkg from "../../../package.json";

export default function Announcement() {
  const tZLog = useTranslations("zLog");
  const tCommon = useTranslations("common");

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
        <div className="flex justify-end gap-2">
          <Button type="primary" onClick={onClose}>
            {tCommon("ok")}
          </Button>
        </div>
      }
    >
      <Image
        src="https://docs.ltopx.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fv0.8.1-1.c9dce942.png&w=1920&q=75"
        alt=""
        width={1920}
        height={800}
      />
      <div className="flex">
        <Button
          type="link"
          target="_blank"
          href="https://docs.ltopx.com/change-log"
        >
          {tZLog("full-log")}
        </Button>
      </div>
      <ul
        role="list"
        className="marker:text-sky-400 mt-3 list-disc pl-5 space-y-3 text-slate-500 max-h-[500px] overflow-y-auto"
      >
        <li>{tZLog("text1")}</li>
        <li>{tZLog("text2")}</li>
        <li>{tZLog("text3")}</li>
        {/* <li>{tZLog("text4")}</li>
        <li>{tZLog("text5")}</li> */}
        {/* <div>
          <Image src="/change_1.jpg" alt="" width={400} height={400} />
        </div>
        <li>{tZLog("text2")}</li>
        <div>
          <Image src="/change_2.jpg" alt="" width={400} height={400} />
        </div>
        <li>{tZLog("text3")}</li>
        <div>
          <Image src="/change_3.jpg" alt="" width={400} height={400} />
        </div> */}
      </ul>
    </Modal>
  );
}
