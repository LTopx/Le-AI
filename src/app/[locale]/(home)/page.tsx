"use client";

require("@/utils/plugin/polyfill-client");

import { cn } from "@/lib";
import Menu from "@/components/menu";
import MobileMenu from "@/components/menu/mobile";
import Setting from "@/components/setting";
import PromptMark from "@/components/prompt/market";
import Navbar from "@/components/navbar";
import Welcome from "@/components/site/welcome";
import ChatSection from "@/components/chatSection";
import Premium from "@/components/premium";
import Recharge from "@/components/recharge";
import TTSSetting from "@/components/ttsSetting";

export default function Home() {
  return (
    <div className="flex h-full w-full top-0 left-0 fixed">
      <Menu />
      <MobileMenu />
      <Setting />
      <PromptMark />
      <Premium />
      <Recharge />
      <TTSSetting />
      <section
        className={cn(
          "transition-colors h-full w-full relative md:w-[calc(100vw-17.5rem)]",
          "bg-gray-100/60 dark:bg-neutral-900"
        )}
      >
        <Navbar />
        <Welcome />
        <ChatSection />
      </section>
    </div>
  );
}
