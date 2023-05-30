"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

const NotFound: React.FC = () => {
  const t = useTranslations("share");

  return <>{t("not-exist")}</>;
};

export default NotFound;
