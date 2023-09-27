"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useInit } from "@/hooks/useInit";
import { cn } from "@/lib";
import Logo from "@/components/site/logo";
import Avatar from "@/components/site/avatar";
import ConfigureModel from "@/components/configureModel";
import LeAi from "@/components/configureModel/leAi";
import LoadingPage from "@/components/loadingPage";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ConfigureKey() {
  const router = useRouter();
  const isInit = useInit();

  const tConfigure = useTranslations("configure");
  const tGlobal = useTranslations("global");

  const [loadingBack, setLoadingBack] = React.useState(false);

  if (!isInit) return <LoadingPage />;

  const onBack = () => {
    setLoadingBack(true);
    router.push("/");
  };

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
      <div className="mt-10 pb-4">
        <div className="w-[32.5rem] max-w-[calc(100vw-2rem)] m-auto p-6 rounded-md border">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 flex"
            disabled={loadingBack}
            onClick={onBack}
          >
            {loadingBack ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          <div className="flex justify-center text-lg font-semibold">
            {tConfigure("model-configure")}
          </div>
          <div className="my-2 flex justify-center">
            <a
              className="text-sky-400 hover:underline text-sm hover:text-sky-500"
              href="https://docs.le-ai.app/api-key-configure"
              target="_blank"
            >
              {tConfigure("model-configure-know-more")}
            </a>
          </div>
          <Tabs defaultValue="1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="1">{tGlobal("official-model")}</TabsTrigger>
              <TabsTrigger value="2">Le-AI</TabsTrigger>
            </TabsList>
            <TabsContent value="1">
              <ConfigureModel />
            </TabsContent>
            <TabsContent value="2">
              <LeAi />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
