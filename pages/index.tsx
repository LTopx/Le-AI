import React from "react";
import { Menu, MobileMenu, Navbar, Welcome, ChatSection } from "@/components";

export default function Home() {
  return (
    <div className="flex h-screen w-full">
      <Menu />
      <MobileMenu />
      <section className="bg-[#fafbfc] h-screen w-full relative md:w-sections">
        <Navbar />
        <Welcome />
        <ChatSection />
      </section>
    </div>
  );
}
