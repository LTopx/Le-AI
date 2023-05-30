"use client";

import * as React from "react";
import { useRouter } from "next-intl/client";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { AiFillCaretLeft } from "react-icons/ai";

const BackHome: React.FC = () => {
  const router = useRouter();
  const t = useTranslations("share");
  const [loading, setLoading] = React.useState(false);

  const onClick = () => {
    setLoading(true);
    router.push("/");
  };

  return (
    <Button
      type="primary"
      leftIcon={<AiFillCaretLeft />}
      loading={loading}
      onClick={onClick}
    >
      {t("back-home")}
    </Button>
  );
};

export default BackHome;
