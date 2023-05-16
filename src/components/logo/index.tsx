"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib";

interface LogoProps {
  disabled?: boolean;
  size?: "default" | "large";
}

const Logo: React.FC<LogoProps> = ({ disabled = false, size = "default" }) => {
  const router = useRouter();

  const onClick = () => {
    if (disabled) return;
    router.push("/");
  };

  return (
    <div
      className={cn(
        "flex font-extrabold h-12 text-transparent items-center",
        { "text-2xl": size === "default" },
        { "text-4xl": size === "large" }
      )}
      onClick={onClick}
    >
      <span className="bg-clip-text select-none cursor-pointer bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
        L - GPT
      </span>
    </div>
  );
};

export default Logo;
