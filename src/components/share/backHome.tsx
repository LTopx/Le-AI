"use client";

import React from "react";
import { useRouter } from "next-intl/client";
import { useTranslations } from "next-intl";
import Icon from "@/components/icon";
import { Button } from "@ltopx/lx-ui";

const BackHome: React.FC = () => {
  const router = useRouter();
  const tGlobal = useTranslations("global");
  const [loading, setLoading] = React.useState(false);

  const onClick = () => {
    setLoading(true);
    router.push("/");
  };

  return (
    <Button
      type="primary"
      icon={<Icon icon="left_fill" />}
      loading={loading}
      onClick={onClick}
      size="lg"
    >
      {tGlobal("return-to-homepage")}
    </Button>
  );
};

export default BackHome;
