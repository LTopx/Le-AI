import * as React from "react";
import * as Slider from "@radix-ui/react-slider";
import classNames from "classnames";

interface LSliderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  // Whether to display slider value
  showValue?: boolean;

  // Maximum value of sliding range
  max?: number;

  // Slide the value of one step
  step?: number;

  // slider value
  value?: number;

  onChange?: (value: number) => void;
}

const LSlider: React.FC<LSliderProps> = ({
  className,
  showValue,
  max = 100,
  step = 1,
  value = 0,
  onChange,
}) => {
  const onValueChange = (value: number[]) => onChange?.(value[0]);

  return (
    <div className="flex items-center gap-2">
      {!!showValue && (
        <div className="min-w-4 text-sm flex justify-center">{value}</div>
      )}
      <div
        className={classNames(
          "px-3 cursor-pointer rounded transition-colors",
          "bg-gray-200/70 hover:bg-gray-200",
          "dark:bg-neutral-700/90 dark:hover:bg-zinc-600",
          className
        )}
      >
        <Slider.Root
          className={classNames(
            "relative flex items-center select-none touch-none h-8"
          )}
          max={max}
          step={step}
          value={[value]}
          onValueChange={onValueChange}
        >
          <Slider.Track
            className={classNames(
              "bg-white relative grow rounded-full h-[3px]",
              "dark:bg-neutral-400"
            )}
          >
            <Slider.Range
              className={classNames(
                "absolute bg-sky-400 rounded-full h-full",
                "dark:bg-sky-400/90"
              )}
            />
          </Slider.Track>
          <Slider.Thumb
            className={classNames(
              "block w-3 h-3 border-2 shadow-lg rounded-full focus:outline-none transition-transform",
              "hover:scale-125",
              "border-sky-400 bg-white",
              "dark:border-sky-400/90"
            )}
          />
        </Slider.Root>
      </div>
    </div>
  );
};

export default LSlider;
