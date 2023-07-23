"use client";

import React from "react";
import { useTranslations } from "next-intl";

const Title: React.FC<{ name: string | null }> = ({ name }) => {
  const tShare = useTranslations("share");

  return <>{name || tShare("untitled")}</>;
};

export default Title;
