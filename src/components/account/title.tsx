"use client";

import React from "react";
import { useTranslations } from "next-intl";

export default function Title() {
  const tGlobal = useTranslations("global");

  return (
    <div className="space-y-0.5">
      <h2 className="text-2xl font-bold tracking-tight">
        {tGlobal("account-center")}
      </h2>
      <p className="text-muted-foreground">{tGlobal("account-center-tip")}</p>
    </div>
  );
}
