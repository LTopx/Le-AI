import React from "react";
import { useSession } from "next-auth/react";
import { shallow } from "zustand/shallow";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { Button } from "@ltopx/lx-ui";
import { useOpenStore } from "@/hooks/useOpen";
import { useUserInfoStore } from "@/hooks/useUserInfo";

export type LicenseTypes = "free" | "premium" | "team";

export interface PremiumBtnProps {
  type: LicenseTypes;
}

const URL = {
  free: "https://lgpt.lemonsqueezy.com/checkout/buy/afc2c698-45e9-4136-a7ea-641779eec8de",
  premium:
    "https://lgpt.lemonsqueezy.com/checkout/buy/ba446f9e-f7c2-4eba-adfd-2c4db87c7b5a",
};

export default function PremiumBtn(props: PremiumBtnProps) {
  const { type } = props;

  const router = useRouter();
  const session = useSession();

  const tPremium = useTranslations("premium");
  const tAuth = useTranslations("auth");

  const updatePremiumOpen = useOpenStore((state) => state.updatePremiumOpen);
  const [freeTrialed, license_type] = useUserInfoStore(
    (state) => [state.freeTrialed, state.license_type],
    shallow
  );

  const onLogin = () => {
    updatePremiumOpen(false);
    router.push("/login");
  };

  if (!session.data) {
    return (
      <div className="flex justify-center mt-3">
        <Button type="primary" onClick={onLogin}>
          {tAuth("log-in-first")}
        </Button>
      </div>
    );
  }

  if (type === "free") {
    return (
      <div className="flex justify-center mt-3">
        <Button
          type="primary"
          disabled={!!freeTrialed}
          href={URL.free}
          target="_blank"
        >
          {freeTrialed
            ? tPremium("free-trial-already")
            : tPremium("get-free-trial")}
        </Button>
      </div>
    );
  }

  if (type === "premium") {
    return (
      <div className="flex justify-center mt-3">
        <Button
          type="primary"
          disabled={license_type === "premium"}
          href={URL.premium}
          target="_blank"
        >
          {license_type === "premium"
            ? tPremium("premium-already")
            : `${tPremium("buy")} L-GPT ${tPremium("premium")}`}
        </Button>
      </div>
    );
  }

  if (type === "team") {
    return (
      <div className="flex justify-center mt-3">
        <Button type="primary" disabled>
          {tPremium("coming-soon")}...
        </Button>
      </div>
    );
  }

  return null;
}
