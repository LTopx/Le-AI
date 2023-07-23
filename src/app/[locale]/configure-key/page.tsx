"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ltopx/lx-ui";
import { useInit } from "@/hooks/useInit";
import { cn } from "@/lib";
import Logo from "@/components/site/logo";
import Avatar from "@/components/site/avatar";
import ConfigureModel from "@/components/configureModel";
import LoadingPage from "@/components/loadingPage";

export default function ConfigureKey() {
  const isInit = useInit();

  const tSetting = useTranslations("setting");

  if (!isInit) return <LoadingPage />;

  return (
    <>
      <div
        className={cn(
          "h-14 flex items-center justify-between px-6 border-b",
          "dark:border-neutral-600"
        )}
      >
        <Logo />
        <Avatar />
      </div>
      <div className="mt-10">
        <div
          className={cn(
            "w-[32.5rem] max-w-[calc(100vw-2rem)] m-auto p-6 rounded-md",
            "border dark:border-neutral-600"
          )}
        >
          <div className="flex justify-center text-lg font-semibold">
            {tSetting("llm-configuration")}
          </div>
          <div className="my-2 flex justify-center">
            <Button
              type="link"
              href="https://docs.ltopx.com/api-key-configure"
              target="_blank"
            >
              {tSetting("configuration-learn-more")}
            </Button>
          </div>
          <ConfigureModel />
        </div>
      </div>
    </>
  );
}
