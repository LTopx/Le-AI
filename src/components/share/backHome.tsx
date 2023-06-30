"use client";

import React from "react";
import { useRouter } from "next-intl/client";
import { useTranslations } from "next-intl";
import Icon from "@/components/icon";
import { Button } from "@/components/ui";

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
      leftIcon={<Icon icon="left_fill" />}
      loading={loading}
      onClick={onClick}
    >
      {t("back-home")}
    </Button>
  );
};

export default BackHome;
