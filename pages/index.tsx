import * as React from "react";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  Menu,
  MobileMenu,
  Navbar,
  Welcome,
  ChatSection,
  Setting,
} from "@/components";

export default function Home() {
  return (
    <div className="flex h-screen w-full">
      <Menu />
      <MobileMenu />
      <Setting />
      <section
        className={clsx(
          "transition-colors h-screen w-full relative md:w-[calc(100vw-17.5rem)]",
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "chat",
        "common",
        "menu",
        "nav",
        "prompt",
        "setting",
        "welcome",
      ])),
    },
  };
};
