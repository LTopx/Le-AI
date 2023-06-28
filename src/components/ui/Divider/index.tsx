import React from "react";
import { cn } from "@/lib";

interface DividerProps extends React.HTMLAttributes<HTMLElement> {}

const Divider: React.FC<DividerProps> = ({ className, children }) => {
  if (!children) {
    return (
      <div
        className={cn(
          "border-b w-full my-4",
          "border-b-neutral-200 dark:border-b-neutral-200/40",
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center my-4",
        "before:h-0 before:flex-1 before:border-b before:border-neutral-200 dark:before:border-neutral-200/40",
        "after:h-0 after:flex-1 after:border-b after:border-neutral-200 dark:after:border-neutral-200/40",
        className
      )}
    >
      <span className="px-4 flex items-center text-neutral-600 dark:text-neutral-400">
        {children}
      </span>
    </div>
  );
};

export default Divider;
