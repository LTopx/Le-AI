"use client";

import React from "react";
import { useTranslations } from "next-intl";

const Title: React.FC<{ name: string | null }> = ({ name }) => {
  const t = useTranslations("share");

  return <>{name || t("untitled")}</>;
};

export default Title;
