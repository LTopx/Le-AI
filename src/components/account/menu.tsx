"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next-intl/client";
import { cn } from "@/lib";

export interface MenuItemProps {
  label: string;
  value: string;
  path: string;
}

export default function Menu() {
  const pathname = usePathname();
  const router = useRouter();
  const tGlobal = useTranslations("global");
  const tAuth = useTranslations("auth");

  const menuItems: MenuItemProps[] = [
    {
      label: tGlobal("usage"),
      value: "account",
      path: "/account",
    },
    {
      label: tGlobal("user-info"),
      value: "info",
      path: "/account/info",
    },
    {
      label: tAuth("change-password"),
      value: "changePwd",
      path: "/account/changePwd",
    },
    {
      label: tGlobal("token"),
      value: "token",
      path: "/account/token",
    },
  ];

  const onClick = (item: MenuItemProps) => {
    if (pathname === item.path) return;
    router.push(item.path);
  };

  return (
    <div className="w-52 flex flex-col gap-1">
      {menuItems.map((item) => (
        <div
          key={item.value}
          onClick={() => onClick(item)}
          className={cn(
            "h-9 px-4 text-sm inline-flex items-center rounded-md font-medium transition-colors select-none",
            "cursor-pointer hover:underline",
            {
              "bg-muted hover:bg-muted hover:no-underline":
                item.path === pathname,
            }
          )}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}
