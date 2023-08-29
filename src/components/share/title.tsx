"use client";

import React from "react";
import { useTranslations } from "next-intl";

const Title: React.FC<{ name: string | null }> = ({ name }) => {
  const tGlobal = useTranslations("global");

  return <>{name || tGlobal("unnamed")}</>;
};

export default Title;
