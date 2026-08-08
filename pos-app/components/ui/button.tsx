import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "ghost-danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Shows a spinner in place of the label and disables the button —
   *  every call site that does its own async-in-flight state (task/habit
   *  forms, settings save/export/import) can now express that visually
   *  without a bespoke "saving…" text swap per screen. */
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white",
  secondary:
    "bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]",
  ghost: "hover:bg-[var(--color-surface-hover)]",
  danger: "bg-[var(--color-danger)] hover:opacity-90 text-white",
  // Sprint 2: destructive-but-quiet actions (delete a task/habit from a
  // list row) were previously using plain `ghost`, visually identical to
  // "cancel" or any other secondary action — no warning color at all.
  "ghost-danger": "text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "focus-ring inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium",
        "transition-[background-color,transform] duration-[var(--duration-fast)] ease-out",
        "active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none disabled:active:scale-100",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
