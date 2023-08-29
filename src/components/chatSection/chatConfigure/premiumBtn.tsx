import React from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@ltopx/lx-ui";
import { useUserInfoStore } from "@/hooks/useUserInfo";
import { useOpenStore } from "@/hooks/useOpen";
import Icon from "@/components/icon";

export default function PremiumBtn() {
  const session = useSession();
  const license_type = useUserInfoStore((state) => state.license_type);

  const tGlobal = useTranslations("global");

  const updatePremiumOpen = useOpenStore((state) => state.updatePremiumOpen);

  if (
    session.status === "loading" ||
    license_type === "premium" ||
    license_type === "team" ||
    license_type === "none"
  ) {
    return null;
  }

  return (
    <Button
      rounded
      outline
      size="sm"
      type="primary"
      icon={<Icon icon="gift_fill" size={18} />}
      onClick={() => updatePremiumOpen(true)}
    >
      {tGlobal("premium")}
    </Button>
  );
}
