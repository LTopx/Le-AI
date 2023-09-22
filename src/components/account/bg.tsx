"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function Bg() {
  const [nowTheme, setNowTheme] = React.useState<any>("dark");
  const { theme } = useTheme();

  React.useEffect(() => {
    setNowTheme(theme);
  }, [theme]);

  if (nowTheme === "dark") return null;

  return (
    <Image
      src="/login-bg.jpg"
      alt="login-bg"
      quality={100}
      fill
      sizes="100vw"
      style={{
        objectFit: "cover",
        zIndex: 5,
      }}
    />
  );
}
