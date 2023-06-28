"use client";

import React from "react";
import * as Slider from "@radix-ui/react-slider";
import { isUndefined, cn } from "@/lib";

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

export default function LSlider({
  className,
  max = 100,
  step = 1,
  defaultValue,
  value,
  onChange,
}: LSliderProps) {
  const onValueChange = (sliderValue: number[]) => onChange?.(sliderValue[0]);

  return (
    <div
      className={cn(
        "px-3 cursor-pointer rounded-md transition-colors",
        className
      )}
    >
      <Slider.Root
        className={cn("relative flex items-center select-none touch-none h-8")}
        max={max}
        step={step}
        defaultValue={isUndefined(defaultValue) ? undefined : [defaultValue]}
        value={isUndefined(value) ? undefined : [value]}
        onValueChange={onValueChange}
      >
        <Slider.Track
          className={cn(
            "bg-neutral-200 relative grow rounded-full h-1.5",
            "dark:bg-neutral-400"
          )}
        >
          <Slider.Range
            className={cn(
              "absolute bg-sky-400 rounded-full h-full",
              "dark:bg-sky-400/90"
            )}
          />
        </Slider.Track>
        <Slider.Thumb
          className={cn(
            "block w-3 h-3 border-2 shadow-lg rounded-full focus:outline-none transition-transform",
            "hover:scale-125",
            "border-sky-400 bg-white",
            "dark:border-sky-400/90"
          )}
        />
      </Slider.Root>
    </div>
  );
}
