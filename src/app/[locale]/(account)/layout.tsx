import React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/utils/plugin/auth";
import { cn } from "@/lib";
import Logo from "@/components/site/logo";
import Avatar from "@/components/site/avatar";
import Menu from "@/components/account/menu";
import Title from "@/components/account/title";
import MobileMenu from "@/components/account/mobileMenu";
import { Separator } from "@/components/ui/separator";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) return redirect("/login");

  return (
    <div className="fixed left-0 top-0 w-full h-full">
      <div
        className={cn(
          "h-14 flex items-center justify-between px-6 border-b",
          "dark:border-neutral-600"
        )}
      >
        <Logo />
        <Avatar />
      </div>
      <div className="pt-10 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
        <div className="w-[1334px] max-w-[calc(100vw-2rem)] m-auto p-10 border rounded-[0.5rem] shadow">
          <Title />
          <Separator className="my-6" />
          <div className="flex gap-12">
            <div className="hidden md:block">
              <Menu />
            </div>
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </div>
      <MobileMenu />
    </div>
  );
}
