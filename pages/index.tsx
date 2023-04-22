import * as React from "react";
import classNames from "classnames";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Menu, MobileMenu, Navbar, Welcome, ChatSection } from "@/components";

export default function Home() {
  return (
    <div className="flex h-screen w-full">
      <Menu />
      <MobileMenu />
      <section
        className={classNames(
          "transition-colors h-screen w-full relative md:w-section",
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
        "common",
        "menu",
        "chat",
        "prompt",
        "nav",
        "welcome",
      ])),
    },
  };
};
