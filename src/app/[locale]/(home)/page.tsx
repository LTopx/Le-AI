"use client";

require("@/utils/plugin/polyfill-client");

import React from "react";
import { useInit } from "@/hooks/useInit";
import PcMenu from "@/components/menu/pc";
import MobileMenu from "@/components/menu/mobile";
import Setting from "@/components/setting";
import Navbar from "@/components/navbar";
import Character from "@/components/character";
import Premium from "@/components/premium";
import ChargeToken from "@/components/chargeToken";
import Welcome from "@/components/site/welcome";
import ChatSection from "@/components/chatSection";
import TTSSetting from "@/components/ttsSetting";
import Plugin from "@/components/plugin";
import Backup from "@/components/backup";
import LoadingPage from "@/components/loadingPage";
import { cn } from "@/lib";

export default function Home() {
  const isInit = useInit();

  if (!isInit) return <LoadingPage />;

  return (
    <div className="flex inset-0 fixed">
      <PcMenu />
      <MobileMenu />
      <Setting />
      <Premium />
      <ChargeToken />
      <TTSSetting />
      <Character />
      <Plugin />
      <Backup />
      <section
        className={cn(
          "transition-colors h-full w-full relative md:w-[calc(100vw-17.5rem)]",
          "bg-gray-100/60 dark:bg-zinc-800"
        )}
      >
        <Navbar />
        <Welcome />
        <ChatSection />
      </section>
    </div>
  );
}
