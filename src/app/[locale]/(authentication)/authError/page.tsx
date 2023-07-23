"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { cn } from "@/lib";
import { Button } from "@ltopx/lx-ui";
import Logo from "@/components/site/logo";

const AuthError: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorCode = searchParams.get("error");
  const tAuth = useTranslations("auth");

  const errorMsg = {
    Configuration: {
      title: tAuth("configuration"),
      text1: tAuth("configuration-1"),
      text2: tAuth("configuration-2"),
      btn: {
        label: tAuth("return-to-home-page"),
        path: "/",
      },
    },
    AccessDenied: {
      title: tAuth("access-denied"),
      text1: tAuth("access-denied-1"),
      btn: {
        label: tAuth("sign-in"),
        path: "/login",
      },
    },
    Verification: {
      title: tAuth("verification"),
      text1: tAuth("verification-1"),
      text2: tAuth("verification-2"),
      btn: {
        label: tAuth("sign-in"),
        path: "/login",
      },
    },
    Default: {
      title: tAuth("error"),
      btn: {
        label: tAuth("return-to-home-page"),
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
    <div className="bg-neutral-200 inset-0 fixed">
      <div
        className={cn(
          "w-[32.5rem] max-w-[calc(100vw-2rem)] bg-white px-12 py-6 rounded-md fixed left-[50%] top-[40%] translate-x-[-50%] translate-y-[-50%]",
          "flex flex-col items-center justify-center gap-4"
        )}
      >
        <Logo disabled size="large" />
        <div className="font-medium text-2xl">{errorMsg.title}</div>
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
