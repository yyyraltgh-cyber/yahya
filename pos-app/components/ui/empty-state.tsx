import { Card } from "@/components/ui/card";
import { Sparkles, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * icon is optional so every existing call site (`<EmptyState message={...} />`)
 * keeps working unchanged. Sparkles is a deliberately soft default — never an
 * alarming "empty box" glyph, matching the "gentle tending needed, never
 * loss" register from the Constitution's Garden Philosophy (§6), applied
 * here to empty states generally. message accepts ReactNode (not just
 * string) so a call site can embed an inline action link.
 */
export function EmptyState({
  message,
  icon: Icon = Sparkles,
}: {
  message: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <Card className="flex flex-col items-center gap-2 py-8 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]">
        <Icon size={18} aria-hidden="true" />
      </div>
      <p className="text-sm text-[var(--color-text-muted)]">{message}</p>
    </Card>
  );
}
