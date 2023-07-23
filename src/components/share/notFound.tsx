"use client";

import React from "react";
import { useTranslations } from "next-intl";

const NotFound: React.FC = () => {
  const tShare = useTranslations("share");

  return <>{tShare("not-exist")}</>;
};

export default NotFound;
