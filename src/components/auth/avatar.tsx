"use client";

import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { AiOutlineUser } from "react-icons/ai";
import { BiUser, BiLogOut, BiLogIn } from "react-icons/bi";
import { HiOutlineDocumentText } from "react-icons/hi";
import Dropdown from "@/components/ui/Dropdown";
import type { IDropdownItems } from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";

const Avatar: React.FC = () => {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("auth");

  const user = session.data?.user;

  const getMenus = (session: Session | null): IDropdownItems[] => {
    let baseMenus = [
      {
        label: t("documentation"),
        value: "documentation",
        icon: <HiOutlineDocumentText />,
      },
      { type: "seperate", value: "seperate_1" },
    ];

    if (session) {
      baseMenus = [
        ...baseMenus,
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
      baseMenus = [
        ...baseMenus,
        ...[
          {
            label: t("log-in"),
            value: "login",
            icon: <BiLogIn />,
          },
        ],
      ];
    }

    return baseMenus;
  };

  const onSelect = async (item: any) => {
    if (item === "login") {
      router.push("/login");
    } else if (item === "logout") {
      await signOut({ callbackUrl: "/" });
    } else if (item === "account") {
      if (pathname.includes("/account")) return;
      router.push("/account");
    }
  };

  return (
    <Dropdown
      align="end"
      trigger={
        user ? (
          <div className="absolute right-3 h-14 w-11 flex justify-end items-center cursor-pointer">
            {user.image ? (
              <Image
                className="rounded-full"
                src="/avatar.jpg"
                width={32}
                height={32}
                alt="Avatar"
              />
            ) : (
              <div className="bg-sky-400 rounded-full w-8 h-8 flex justify-center items-center">
                <AiOutlineUser className="text-white" size={20} />
              </div>
            )}
          </div>
        ) : (
          <div className="absolute right-3 h-14 flex items-center">
            <Button>{t("log-in")}</Button>
          </div>
        )
      }
      content={
        user ? (
          <div className="border-b pb-1 px-2">
            <div className="font-medium text-sm">{user.name}</div>
            <div className="text-xs">{user.email}</div>
          </div>
        ) : null
      }
      options={getMenus(session.data)}
      onSelect={onSelect}
    />
  );
};

export default Avatar;
