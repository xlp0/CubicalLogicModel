import { forwardRef, ChangeEvent } from "react";
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

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, onChange, ...props }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(Number(e.target.value));
    };

    return (
      <div className="relative w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <input
          type="range"
          className={cn(
            "w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4",
            "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500",
            "[&::-webkit-slider-thumb]:hover:bg-blue-600 [&::-webkit-slider-thumb]:transition-colors",
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
