import * as React from "react";
import * as Progress from "@radix-ui/react-progress";
import { AiOutlinePieChart } from "react-icons/ai";
import { BsLightningCharge } from "react-icons/bs";
import { cn } from "@/lib";
import { useUserInfo, useRecharge } from "@/hooks";
import { Button } from "@/components/ui";

export default function Tokens({ type }: { type: "pc" | "mobile" }) {
  const [tokens] = useUserInfo();
  const [, setOpen] = useRecharge();
  const { costTokens, availableTokens } = tokens;

  const [toggle, setToggle] = React.useState(false);

  const percent = React.useMemo(() => {
    if (!availableTokens) return 0;

    const left = ((availableTokens - costTokens) / availableTokens) * 100;

    return left < 0 ? 0 : Math.floor(left);
  }, [costTokens, availableTokens]);

  const onRecharge = (e: any) => {
    e.stopPropagation();
    setOpen(true);
    // window.location.href =
    //   "https://ltopx.lemonsqueezy.com/checkout/buy/df7a231a-ebb4-487e-9a10-961f10e47246";
  };

  return (
    <div
      className={cn(
        "h-11 text-sm cursor-pointer rounded-md flex items-center gap-2 px-2 transition-colors",
        "hover:bg-gray-200/60 dark:hover:bg-slate-700/70",
        { "rounded-md text-black/90 dark:text-white/90": type === "mobile" }
      )}
      onClick={() => setToggle((prev) => !prev)}
    >
      <AiOutlinePieChart size={18} />
      <div className="flex-1 flex items-center gap-2 group">
        <div>Token</div>
        {!toggle ? (
          <div className="flex flex-1 items-center gap-1">
            <Progress.Root
              className="flex-1 overflow-hidden rounded-full w-full h-4 bg-neutral-100 dark:bg-neutral-600"
              style={{ transform: "translateZ(0)" }}
              value={percent}
            >
              <Progress.Indicator
                className={cn(
                  "w-full h-full transition-all duration-700",
                  "bg-sky-200",
                  { "bg-amber-200": percent < 30 },
                  { "bg-rose-200": percent < 10 }
                )}
                style={{ transform: `translateX(-${100 - percent}%)` }}
              />
            </Progress.Root>
            <div
              className={cn(
                "text-xs text-neutral-400",
                { "text-amber-300": percent < 30 },
                { "text-rose-200": percent < 10 }
              )}
            >
              {percent}%
            </div>
          </div>
        ) : (
          <div className="flex-1 flex gap-1 text-xs justify-end text-neutral-600">
            <span
              className={cn(
                { "text-amber-300": percent < 30 },
                { "text-rose-200": percent < 10 }
              )}
            >
              {availableTokens - costTokens < 0
                ? 0
                : availableTokens - costTokens}
            </span>
            <span>/</span>
            <span className="dark:text-neutral-500">{availableTokens}</span>
          </div>
        )}
        <div className="text-xs hidden group-hover:block">
          <Button size="xs" type="primary" onClick={onRecharge}>
            <BsLightningCharge />
          </Button>
        </div>
      </div>
    </div>
  );
}
