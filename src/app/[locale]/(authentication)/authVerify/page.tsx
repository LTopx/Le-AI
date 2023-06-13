"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib";
import Logo from "@/components/site/logo";

const AuthVerify: React.FC = () => {
  const t = useTranslations("auth");

  return (
    <div className="bg-neutral-200 fixed inset-0">
      <div
        className={cn(
          "w-[32.5rem] max-w-[calc(100vw-2rem)] bg-white px-12 py-6 rounded-md fixed left-[50%] top-[40%] translate-x-[-50%] translate-y-[-50%]",
          "flex flex-col items-center justify-center gap-4"
        )}
      >
        <Logo disabled size="large" />
        <div className="text-2xl font-medium">{t("check-email")}</div>
        <div>{t("sign-in-link")}</div>
      </div>
    </div>
  );
};

export default AuthVerify;
