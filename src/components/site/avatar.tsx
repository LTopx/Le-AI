"use client";

import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next-intl/client";
import Image from "next/image";
import { BiUser, BiLogOut, BiLogIn } from "react-icons/bi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { AiOutlineAppstoreAdd, AiOutlineUser } from "react-icons/ai";
import { usePromptOpen } from "@/hooks";
import Dropdown from "@/components/ui/Dropdown";
import type { IDropdownItems } from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";

export default function Avatar() {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [, setOpen] = usePromptOpen();

  const [loadingLogin, setLoadingLogin] = React.useState(false);

  const t = useTranslations("auth");

  const user = session.data?.user;

  const getMenus = React.useCallback((): IDropdownItems[] => {
    let menus: IDropdownItems[] = [
      {
        label: t("documentation"),
        value: "documentation",
        icon: <HiOutlineDocumentText />,
      },
      {
        label: t("prompt-market"),
        value: "prompt-market",
        icon: <AiOutlineAppstoreAdd />,
      },
      { type: "seperate", value: "seperate_1" },
    ];

    if (pathname !== "/") menus.splice(1, 1);

    if (session.data) {
      menus = [
        ...menus,
        ...[
          {
            label: t("account-center"),
            value: "account",
            icon: <BiUser />,
          },
          {
            label: t("log-out"),
            value: "logout",
            icon: <BiLogOut />,
          },
        ],
      ];
    } else {
      menus = [
        ...menus,
        ...[
          {
            label: t("log-in"),
            value: "login",
            icon: <BiLogIn />,
          },
        ],
      ];
    }

    return menus;
  }, [session.data, pathname]);

  const onSelect = async (item: string) => {
    if (item === "login") {
      setLoadingLogin(true);
      router.push("/login");
    } else if (item === "logout") {
      await signOut({ callbackUrl: "/" });
    } else if (item === "account") {
      if (pathname.includes("/account")) return;
      router.push("/account");
    } else if (item === "documentation") {
      const url =
        locale === "zh-CN"
          ? "https://docs.ltopx.com/zh-CN"
          : "https://docs.ltopx.com";
      window.open(url);
    } else if (item === "prompt-market") {
      setOpen(true);
    }
  };

  return (
    <Dropdown
      className="min-w-[8rem]"
      align="end"
      disabled={loadingLogin}
      trigger={
        session.status === "loading" ? (
          <div className="flex h-14 right-3 absolute items-center">
            <Button loading type="primary" />
          </div>
        ) : user ? (
          <div className="cursor-pointer flex h-14 right-3 w-11 absolute justify-end items-center">
            {user.image ? (
              <Image
                className="rounded-full"
                src={user.image}
                alt="Avatar"
                width={32}
                height={32}
              />
            ) : (
              <div className="rounded-full flex bg-sky-400 h-8 w-8 justify-center items-center">
                <AiOutlineUser className="text-white" size={20} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-14 right-3 absolute items-center">
            <Button type="primary" loading={loadingLogin}>
              {t("log-in")}
            </Button>
          </div>
        )
      }
      content={
        user ? (
          <div className="border-b px-2 pb-1">
            <div className="font-medium text-sm">
              {user.name || user.email?.split("@")[0]}
            </div>
            <div className="text-xs">{user.email}</div>
          </div>
        ) : null
      }
      options={getMenus()}
      onSelect={onSelect}
    />
  );
}
