import * as React from "react";
import { cn } from "@/lib";

interface DividerProps extends React.HTMLAttributes<HTMLElement> {}

const Divider: React.FC<DividerProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "h-[1px] w-full bg-neutral-200 dark:bg-neutral-200/40 my-4",
        className
      )}
    />
  );
};

export default Divider;
