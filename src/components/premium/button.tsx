import * as React from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";
import type { LicenseType } from "@/hooks";

export type LicenseTabTypes = "free" | "premium" | "team";

interface IProps {
  type: LicenseTabTypes;
  license_type: LicenseType;
  freeTrialed: number;
  onLogin: () => void;
  onPay: (url: string) => void;
}

const URL = {
  free: "https://lgpt.lemonsqueezy.com/checkout/buy/afc2c698-45e9-4136-a7ea-641779eec8de",
  premium:
    "https://lgpt.lemonsqueezy.com/checkout/buy/ba446f9e-f7c2-4eba-adfd-2c4db87c7b5a",
};

const PremiumBtn: React.FC<IProps> = ({
  type,
  license_type,
  freeTrialed,
  onLogin,
  onPay,
}) => {
  const session = useSession();

  const t = useTranslations("premium");
  const tAuth = useTranslations("auth");

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
          onClick={() => onPay(URL.free)}
          disabled={!!freeTrialed}
        >
          {freeTrialed ? t("free-trial-already") : t("get-free-trial")}
        </Button>
      </div>
    );
  }

  if (type === "premium") {
    return (
      <div className="flex justify-center mt-3">
        <Button
          type="primary"
          onClick={() => onPay(URL.premium)}
          disabled={license_type === "premium"}
        >
          {license_type === "premium"
            ? t("premium-already")
            : `${t("buy")} L-GPT ${t("premium")}`}
        </Button>
      </div>
    );
  }

  if (type === "team") {
    return (
      <div className="flex justify-center mt-3">
        <Button type="primary" disabled>
          {t("coming-soon")}...
        </Button>
      </div>
    );
  }

  return null;
};

export default PremiumBtn;
