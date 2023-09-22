"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useDateFormat } from "l-hooks";
import Icon from "@/components/icon";

const ViewsCount: React.FC<{ count: number; time: any; from: string }> = ({
  count,
  time,
  from,
}) => {
  const tShare = useTranslations("share");

  const { format } = useDateFormat();

  return (
    <div className="flex flex-col gap-2">
      {!!from && (
        <div>
          {tShare("from")} {from}
        </div>
      )}
      <div className="flex gap-2 items-center">
        <div className="flex gap-1">
          <Icon icon="time_line" size={18} />
          <span>{format(time, "YYYY-MM-DD")}</span>
        </div>
        <span>|</span>
        <div className="flex gap-1">
          <Icon icon="user_visible_line" size={18} />
          {tShare("page-views")}：{count}
        </div>
      </div>
    </div>
  );
};

export default ViewsCount;
