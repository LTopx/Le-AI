"use client";

import clsx from "clsx";
import ChatSection from "@/components/chatSection";
import Menu from "@/components/menu";
import MobileMenu from "@/components/menu/mobile";
import Navbar from "@/components/navbar";
import Setting from "@/components/setting";
import Welcome from "@/components/welcome";
import React from "react";
import "@/utils/plugin/polyfill-client";

export default function Home() {
  React.useEffect(() => {
    console.log(window, "window1");
  }, []);

  return (
    <div className="flex h-full w-full top-0 left-0 fixed">
      <Menu />
      <MobileMenu />
      <Setting />
      <section
        className={clsx(
          "transition-colors h-full w-full relative md:w-[calc(100vw-17.5rem)]",
          "bg-gray-100/60",
          "dark:bg-neutral-900"
        )}
      >
        <Navbar />
        <Welcome />
        <ChatSection />
      </section>
    </div>
  );
}
