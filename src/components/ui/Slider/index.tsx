import * as React from "react";
import * as Slider from "@radix-ui/react-slider";
import clsx from "clsx";
import { isUndefined } from "@/lib";

interface LSliderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  // Maximum value of sliding range
  max?: number;

  // Slide the value of one step
  step?: number;

  // slider defaultValue
  defaultValue?: number;

  // slider value
  value?: number;

  onChange?: (value: number) => void;
}

const LSlider: React.FC<LSliderProps> = ({
  className,
  max = 100,
  step = 1,
  defaultValue,
  value,
  onChange,
}) => {
  const onValueChange = (sliderValue: number[]) => onChange?.(sliderValue[0]);

  return (
    <div
      className={clsx(
        "px-3 cursor-pointer rounded transition-colors",
        "bg-gray-200/70 hover:bg-gray-200",
        "dark:bg-neutral-700/90 dark:hover:bg-zinc-600",
        className
      )}
    >
      <Slider.Root
        className={clsx(
          "relative flex items-center select-none touch-none h-8"
        )}
        max={max}
        step={step}
        defaultValue={isUndefined(defaultValue) ? undefined : [defaultValue]}
        value={isUndefined(value) ? undefined : [value]}
        onValueChange={onValueChange}
      >
        <Slider.Track
          className={clsx(
            "bg-white relative grow rounded-full h-[3px]",
            "dark:bg-neutral-400"
          )}
        >
          <Slider.Range
            className={clsx(
              "absolute bg-sky-400 rounded-full h-full",
              "dark:bg-sky-400/90"
            )}
          />
        </Slider.Track>
        <Slider.Thumb
          className={clsx(
            "block w-3 h-3 border-2 shadow-lg rounded-full focus:outline-none transition-transform",
            "hover:scale-125",
            "border-sky-400 bg-white",
            "dark:border-sky-400/90"
          )}
        />
      </Slider.Root>
    </div>
  );
};

export default LSlider;
