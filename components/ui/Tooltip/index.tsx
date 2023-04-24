import * as React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import classNames from "classnames";

interface LTooltipProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  delayDuration?: number;
  title?: React.ReactNode;
}

const LTooltip: React.FC<LTooltipProps> = ({
  children,
  delayDuration = 500,
  title,
}) => {
  return (
    <Tooltip.Provider delayDuration={delayDuration}>
      <Tooltip.Root>
        <Tooltip.Trigger>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            align="start"
            className={classNames(
              "z-[2000] py-2 px-4 text-sm rounded-md shadow-md max-w-xs break-words",
              "data-[state=delayed-open]:animate-fadeInUp data-[state=closed]:animate-fadeOut",
              "bg-neutral-800 text-white/90",
              "dark:bg-neutral-700 dark:text-white/90"
            )}
            sideOffset={5}
          >
            {title}
            <Tooltip.Arrow className="fill-neutral-800 dark:fill-neutral-700" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default LTooltip;
