"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { cn } from "@/lib";
import { Button } from "@/components/ui";
import Logo from "@/components/site/logo";

const AuthError: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorCode = searchParams.get("error");
  const t = useTranslations("auth");

  const errorMsg = {
    Configuration: {
      title: t("configuration"),
      text1: t("configuration-1"),
      text2: t("configuration-2"),
      btn: {
        label: t("return-to-home-page"),
        path: "/",
      },
    },
    AccessDenied: {
      title: t("access-denied"),
      text1: t("access-denied-1"),
      btn: {
        label: t("sign-in"),
        path: "/login",
      },
    },
    Verification: {
      title: t("verification"),
      text1: t("verification-1"),
      text2: t("verification-2"),
      btn: {
        label: t("sign-in"),
        path: "/login",
      },
    },
    Default: {
      title: t("error"),
      btn: {
        label: t("return-to-home-page"),
        path: "/",
      },
    },
  }[errorCode as string] || {
    title: "Error",
    btn: {
      label: "返回首页",
      path: "/",
    },
  };

  const onClick = (path: string) => router.replace(path);

  return (
    <div className="bg-neutral-200 fixed inset-0">
      <div
        className={cn(
          "w-[32.5rem] max-w-[calc(100vw-2rem)] bg-white px-12 py-6 rounded-md fixed left-[50%] top-[40%] translate-x-[-50%] translate-y-[-50%]",
          "flex flex-col items-center justify-center gap-4"
        )}
      >
        <Logo disabled size="large" />
        <div className="text-2xl font-medium">{errorMsg.title}</div>
        {!!errorMsg.text1 && <div className="break-all">{errorMsg.text1}</div>}
        {!!errorMsg.text2 && <div className="break-all">{errorMsg.text2}</div>}
        {!!errorMsg.btn && (
          <Button onClick={() => onClick(errorMsg.btn.path)}>
            {errorMsg.btn.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AuthError;
