"use client";

import clsx from "clsx";
import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, hint, id, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-mist">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={clsx(
          "w-full rounded-lg bg-surface-2 border border-hairline px-4 py-2.5 text-sm text-paper placeholder:text-fog outline-none transition-colors duration-200 focus:border-hairline-strong focus:bg-surface-3",
          className
        )}
        {...props}
      />
      {hint && <span className="text-xs text-fog">{hint}</span>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
