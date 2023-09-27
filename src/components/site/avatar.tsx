"use client";

import React from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next-intl/client";
import { Button, type DropdownOption } from "@ltopx/lx-ui";
import { useUserInfoStore } from "@/hooks/useUserInfo";
import { useOpenStore } from "@/hooks/useOpen";
import { checkAuth } from "@/lib/checkEnv";
import Icon from "@/components/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Avatar() {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const tGlobal = useTranslations("global");
  const tPremium = useTranslations("premium");

  const [loading, setLoading] = React.useState(false);

  const user = session.data?.user;

  const license_type = useUserInfoStore((state) => state.license_type);
  const updateUserInfo = useUserInfoStore((state) => state.update);
  const updatePremiumOpen = useOpenStore((state) => state.updatePremiumOpen);

  const menus = React.useMemo(() => {
    let base: DropdownOption[] = [
      {
        label: (
          <div className="flex gap-2 items-center">
            <Icon icon="document_line" />
            {tGlobal("docs")}
          </div>
        ),
        value: "documentation",
      },
    ];

    if (session.data) {
      if (license_type === "free") {
        base.unshift({
          label: (
            <div className="flex gap-2 items-center">
              <Icon icon="vip_3_line" />
              <span className="text-neutral-400">{tPremium("free-trial")}</span>
            </div>
          ),
          value: "license",
        });
      } else if (license_type === "premium") {
        base.unshift({
          label: (
            <div className="flex gap-2 items-center">
              <Icon icon="vip_3_line" />
              <span className="bg-clip-text bg-license-premium text-transparent">
                {tGlobal("premium")}
              </span>
            </div>
          ),
          value: "license",
        });
      } else if (license_type === "team") {
        base.unshift({
          label: (
            <div className="flex gap-2 items-center">
              <Icon icon="vip_3_line" />
              <span className="bg-clip-text bg-license-team text-transparent">
                {tPremium("team")}
              </span>
            </div>
          ),
          value: "license",
        });
      }

      if (pathname === "/") {
        base.push({
          label: (
            <div className="flex gap-2 items-center">
              <Icon icon="gift_fill" />
              {tPremium("more-license")}
            </div>
          ),
          value: "more-license",
        });
      }
      base = [
        ...base,
        { type: "seperate", value: "seperate_1" },
        {
          label: (
            <div className="flex gap-2 items-center">
              <Icon icon="user_3_line" />
              {tGlobal("account-center")}
            </div>
          ),
          value: "account",
        },
        {
          label: (
            <div className="flex gap-2 items-center">
              <Icon icon="exit_line" />
              {tGlobal("log-out")}
            </div>
          ),
          value: "logout",
        },
      ];
    } else if (checkAuth()) {
      base = [
        ...base,
        { type: "seperate", value: "seperate_1" },
        {
          label: (
            <div className="flex gap-2 items-center">
              <Icon icon="entrance_line" />
              {tGlobal("sign-in")}
            </div>
          ),
          value: "login",
        },
      ];
    }

    return base;
  }, [pathname, session.data, license_type]);

  const disabled = !!(loading || session.status === "loading");

  const renderLabel = () => {
    if (!user) return null;
    return (
      <>
        <DropdownMenuLabel>
          <div className="font-medium text-sm">
            {user.name || user.email?.split("@")[0]}
          </div>
          <div className="text-xs">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
      </>
    );
  };

  const onSelect = async (value: string) => {
    switch (value) {
      case "login":
        setLoading(true);
        router.push("/login");
        break;
      case "logout":
        await signOut({ callbackUrl: "/" });
        break;
      case "documentation":
        window.open("https://docs.le-ai.app");
        break;
      case "license":
        if (pathname !== "/") return;
        setTimeout(() => {
          updatePremiumOpen(true);
        }, 0);
        break;
      case "more-license":
        if (pathname !== "/") return;
        setTimeout(() => {
          updatePremiumOpen(true);
        }, 0);
        break;
      case "account":
        if (pathname.includes("/account")) return;
        router.push("/account");
        break;
    }
  };

  React.useEffect(() => {
    if (session.data) updateUserInfo(0);
  }, [session.data]);

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none" disabled={disabled}>
          {session.data?.user ? (
            <div className="cursor-pointer">
              {session.data.user.image ? (
                <Image
                  className="rounded-full"
                  src={session.data.user.image}
                  alt="Avatar"
                  width={32}
                  height={32}
                />
              ) : (
                <div className="rounded-full flex bg-sky-400 h-8 w-8 justify-center items-center">
                  <Icon icon="user_3_fill" className="text-white" size={20} />
                </div>
              )}
            </div>
          ) : (
            <Button
              type="primary"
              size="sm"
              icon={<Icon icon="user_add_2_line" size={18} />}
              loading={disabled}
            />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {renderLabel()}
          {menus.map((item) => {
            if (item.type === "seperate")
              return <DropdownMenuSeparator key={item.value} />;
            return (
              <DropdownMenuItem
                key={item.value}
                className="cursor-pointer"
                onClick={() => onSelect(item.value)}
              >
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
