"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next-intl/client";
import { motion } from "framer-motion";
import { cn } from "@/lib";
import Bg from "./bg";
import Icon from "./icon";
import type { MenuItemProps } from "../menu";

function Content({ children }: { children: React.ReactNode }) {
  return (
    <nav className="pointer-events-none fixed bottom-20 right-7 z-10 max-w-[60%] select-none text-end">
      <motion.ul
        className="flex flex-col items-end gap-2"
        variants={{
          open: { transition: { staggerChildren: 0.02 } },
          closed: {
            transition: { staggerDirection: -1, staggerChildren: 0.02 },
          },
        }}
      >
        {children}
      </motion.ul>
    </nav>
  );
}

const MobileMenu: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const tAccount = useTranslations("account");

  const [open, setOpen] = React.useState(false);

  const menuItems: MenuItemProps[] = [
    {
      label: tAccount("usage"),
      value: "account",
      path: "/account",
    },
    // {
    //   label: t("teams"),
    //   value: "team",
    //   path: "/account/team",
    // },
    {
      label: tAccount("user-info"),
      value: "info",
      path: "/account/info",
    },
  ];

  const onOpen = (e: any) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const onSelect = (item: MenuItemProps) => {
    if (pathname === item.path) return;
    router.push(item.path);
  };

  const onClose = () => setOpen(false);

  return (
    <motion.div
      initial={false}
      animate={open ? "open" : "closed"}
      variants={{
        open: { transition: { staggerChildren: 0.1 } },
        closed: { transition: { staggerChildren: 0.1, staggerDirection: -1 } },
      }}
      onClick={onClose}
      className="md:hidden"
    >
      <Bg />
      <Icon onClick={onOpen} />
      <Content>
        {menuItems.map((item) => (
          <motion.li
            key={item.value}
            variants={{
              open: {
                x: "0",
                opacity: "100%",
                pointerEvents: "auto",
                transition: {
                  type: "spring",
                  duration: 0.5,
                },
              },
              closed: {
                x: "30vw",
                opacity: "0%",
                pointerEvents: "none",
                transition: {
                  type: "spring",
                  duration: 0.5,
                },
              },
            }}
          >
            <div
              className={cn(
                "tracking-tight cursor-pointer dark:text-white/70 transition-all",
                {
                  "font-semibold text-xl dark:text-white":
                    item.path === pathname,
                }
              )}
              onClick={() => onSelect(item)}
            >
              {item.label}
            </div>
          </motion.li>
        ))}
      </Content>
    </motion.div>
  );
};

export default MobileMenu;
