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
  const tGlobal = useTranslations("global");

  const errorMsg = {
    Configuration: {
      title: "Server error",
      text1: "There is a problem with the server configuration.",
      text2: "Check the server logs for more information.",
      btn: {
        label: tGlobal("return-to-homepage"),
        path: "/",
      },
    },
    AccessDenied: {
      title: "Access Denied",
      text1: "You do not have permission to sign in.",
      btn: {
        label: tGlobal("sign-in"),
        path: "/login",
      },
    },
    Verification: {
      title: "Unable to sign in",
      text1: "The sign in link is no longer valid.",
      text2: "It may have been used already or it may have expired.",
      btn: {
        label: tGlobal("sign-in"),
        path: "/login",
      },
    },
    Default: {
      title: tGlobal("error"),
      btn: {
        label: tGlobal("return-to-homepage"),
        path: "/",
      },
    },
  }[errorCode as string] || {
    title: tGlobal("error"),
    btn: {
      label: tGlobal("return-to-homepage"),
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
