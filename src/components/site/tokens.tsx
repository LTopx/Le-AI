import React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Button } from "@ltopx/lx-ui";
import { cn } from "@/lib";
import Icon from "@/components/icon";
import { useUserInfoStore } from "@/hooks/useUserInfo";
import { useOpenStore } from "@/hooks/useOpen";

export default function Tokens({ mobile = false }: { mobile?: boolean }) {
  const session = useSession();
  const tPoints = useTranslations("points");

  const availableTokens = useUserInfoStore((state) => state.availableTokens);

  const updateChargeTokenOpen = useOpenStore(
    (state) => state.updateChargeTokenOpen
  );

  const onRecharge = (e: any) => {
    e.stopPropagation();
    updateChargeTokenOpen(true);
  };

  if (!session.data) return null;

  return (
    <div
      className={cn(
        "h-11 rounded-lg transition-colors text-sm cursor-pointer flex items-center gap-2 px-2",
        "hover:bg-gray-200/60 dark:hover:bg-slate-700/70",
        { "rounded-md text-black/90 dark:text-white/90": mobile }
      )}
    >
      <Icon icon="chart_pie_line" size={18} />
      <div className="flex flex-1 gap-2 items-center group">
        <div>{tPoints("points")}</div>
        <div className="flex flex-1 text-xs gap-1 justify-end">
          {availableTokens <= 0 ? 0 : availableTokens}
        </div>
        <div className="text-xs hidden group-hover:block">
          <Button size="sm" type="primary" onClick={onRecharge}>
            <Icon icon="lightning_line" />
          </Button>
        </div>
      </div>
    </div>
  );
}
