import React from "react";
import { useRouter } from "next-intl/client";
import { cn } from "@/lib";
import { Button } from "@ltopx/lx-ui";
import Icon from "@/components/icon";

export default function ApiKey() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const onClick = () => {
    setLoading(true);
    router.push("/configure-key");
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between py-2 px-1 border-b",
        "border-slate-100 dark:border-neutral-500/60"
      )}
    >
      <div className="text-sm">API Key</div>
      <Button
        type="primary"
        loading={loading}
        onClick={onClick}
        icon={<Icon icon="settings_3_line" size={18} />}
      />
    </div>
  );
}
