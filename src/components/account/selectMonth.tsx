import React from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Props {
  month: string;
  onChange: (value: string) => void;
}

export default function SelectMonth({ month, onChange }: Props) {
  const tGlobal = useTranslations("global");

  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => ({
    label: item,
    value: String(item),
  }));

  if (!month) return null;

  return (
    <div className="flex flex-col space-y-2 w-full">
      <Label htmlFor="month">{tGlobal("month")}</Label>
      <Select value={month} onValueChange={onChange}>
        <SelectTrigger
          id="month"
          className="w-[500px] max-w-[calc(100vw-6.8rem)] h-9"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          {months.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
