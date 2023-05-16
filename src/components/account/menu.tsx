"use client";

import * as React from "react";
import { cn } from "@/lib";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface MenuItemProps {
  label: string;
  value: string;
  path: string;
}

const Menu: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("account");

  const menuItems: MenuItemProps[] = [
    {
      label: t("account"),
      value: "account",
      path: "/account",
    },
    {
      label: t("teams"),
      value: "team",
      path: "/account/team",
    },
  ];

  const activePath = pathname.split("/").slice(-1)[0];

  const onClick = (item: MenuItemProps) => {
    if (activePath === item.value) return;
    router.push(item.path);
  };

  return (
    <div className="w-60">
      {menuItems.map((item) => (
        <div
          key={item.value}
          onClick={() => onClick(item)}
          className={cn(
            "h-10 rounded-md flex items-center select-none pl-3 cursor-pointer transition-colors text-sm",
            "text-black/70 hover:bg-neutral-200",
            "dark:text-white/60 dark:hover:bg-neutral-700",
            {
              "text-black dark:text-white font-medium":
                item.value === activePath,
            }
          )}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default Menu;
