import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "focus-ring h-10 w-full appearance-none rounded-[var(--radius-md)] border border-[var(--color-border)]",
        "bg-[var(--color-background)] bg-[length:16px] bg-[position:right_0.6rem_center] bg-no-repeat rtl:bg-[position:left_0.6rem_center]",
        "ps-3 pe-8 text-sm outline-none transition-colors duration-[var(--duration-fast)] focus:border-[var(--color-primary)]",
        className
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ba89f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
      }}
      {...props}
    >
      {children}
    </select>
  );
}
