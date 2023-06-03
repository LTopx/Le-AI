"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function NotFound() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const onBackHome = () => {
    setLoading(true);
    router.push("/");
  };

  return (
    <div className="mx-auto flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col">
        <p className="text-lg font-bold mb-2">404 Not Found</p>
        <Button loading={loading} onClick={onBackHome}>
          Back Home
        </Button>
      </div>
    </div>
  );
}
