import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  className?: string;
  label?: string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(Number(e.target.value));
    };

    return (
      <div className="relative w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium">
            {label}
          </label>
        )}
        <input
          type="range"
          className={cn(
            "w-full cursor-pointer appearance-none bg-gray-200 rounded-lg h-2 accent-primary",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "hover:bg-gray-300",
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
