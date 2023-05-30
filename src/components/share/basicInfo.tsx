"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AiOutlineFieldTime, AiOutlineUsergroupAdd } from "react-icons/ai";
import { useDateFormat } from "l-hooks";

const ViewsCount: React.FC<{ count: number; time: any; from: string }> = ({
  count,
  time,
  from,
}) => {
  const t = useTranslations("share");
  const { format } = useDateFormat();

  return (
    <div className="flex flex-col gap-2">
      {!!from && (
        <div>
          {t("from")} {from}
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <AiOutlineFieldTime size={20} />
          <span>{format(time, "YYYY-MM-DD")}</span>
        </div>
        <span>|</span>
        <div className="flex gap-1">
          <AiOutlineUsergroupAdd size={20} />
          {t("page-views")}：{count}
        </div>
      </div>
    </div>
  );
};

export default ViewsCount;
