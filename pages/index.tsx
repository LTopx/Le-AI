import * as React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Menu, MobileMenu, Navbar, Welcome, ChatSection } from "@/components";

export default function Home() {
  return (
    <div className="flex h-screen w-full">
      <Menu />
      <MobileMenu />
      <section className="bg-[#fafbfc] transition-colors dark:bg-neutral-950 h-screen w-full relative md:w-sections">
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
      // Will be passed to the page component as props
    },
  };
};
