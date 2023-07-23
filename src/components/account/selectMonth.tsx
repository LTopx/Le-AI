"use client";

import React from "react";
import { Select } from "@ltopx/lx-ui";

interface Props {
  month: string;
  onChange: (value: string) => void;
}

export default function SelectMonth({ month, onChange }: Props) {
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => ({
    label: item,
    value: String(item),
  }));

  if (!month) return null;

  return (
    <Select
      className="w-44"
      options={months}
      value={month}
      onChange={onChange}
    />
  );
}
