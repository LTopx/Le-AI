"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { VscDebugContinue } from "react-icons/vsc";
import Button from "@/components/ui/Button";

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
      rightIcon={<VscDebugContinue />}
      loading={loading}
      onClick={onContinue}
    >
      {t("continue-conversation")}
    </Button>
  );
};

export default Continue;
