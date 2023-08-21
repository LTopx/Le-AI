"use client";

import { useTranslations } from "next-intl";

export default function ManageKey() {
  const tAccount = useTranslations("account");

  return (
    <div>
      <div className="text-2xl font-semibold">{tAccount("key-manage")}</div>
      <div className="text-sm mt-4 mb-8">{tAccount("key-manage-tip")}</div>
    </div>
  );
}
