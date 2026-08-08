import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({
  className,
  interactive = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "border border-[var(--color-border)] bg-[var(--color-surface)] p-5",
        "rounded-[var(--radius-card)]",
        interactive &&
          "transition-[transform,box-shadow] duration-[var(--duration-base)] ease-out hover:-translate-y-0.5 hover:shadow-[var(--elevation-raised)] active:translate-y-0 active:scale-[0.99]",
        className
      )}
      {...props}
    />
  );
}
