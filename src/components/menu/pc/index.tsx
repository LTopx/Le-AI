import React from "react";
import { cn } from "@/lib";
import Logo from "@/components/site/logo";
import AddChannel from "../addChannel";
import List from "./list";
import Handler from "./handler";

export default function PcMenu() {
  return (
    <div
      className={cn(
        "px-2 pb-2 hidden md:block md:w-[17.5rem] transition-colors select-none",
        "bg-white dark:bg-slate-800"
      )}
    >
      <div className="flex h-14 pl-1 items-center">
        <Logo disabled />
      </div>
      <AddChannel />
      <List />
      <Handler />
    </div>
  );
}
