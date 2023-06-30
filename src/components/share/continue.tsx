"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import Icon from "@/components/icon";
import { Button } from "@/components/ui";

interface IProps {
  id: string;
}

const Continue: React.FC<IProps> = ({ id }) => {
  const t = useTranslations("share");
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const onContinue = () => {
    setLoading(true);
    router.push(`/create/${id}`);
  };

  return (
    <Button
      type="outline"
      size="base"
      rightIcon={<Icon icon="navigation_fill" size={18} />}
      loading={loading}
      onClick={onContinue}
    >
      {t("continue-conversation")}
    </Button>
  );
};

export default Continue;
