import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * A single stat cell: icon + label + a large value, optionally a link.
 * Deliberately not built on top of <Card> — Card's job is a page-width
 * surface with internal rhythm (heading, body, footer); this is a
 * small, dense number cell meant to sit edge-to-edge against its grid
 * siblings, so it uses a lighter surface treatment on purpose.
 *
 * Originally built for Home's bento grid (components/today/), relocated
 * here once Statistics needed the same shape — this is the shared
 * primitive now, not a Home-specific one.
 */
export function StatTile({
  icon: Icon,
  label,
  value,
  tone = "primary",
  href,
  className,
  children,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  tone?: "primary" | "accent" | "warning" | "success";
  href?: string;
  className?: string;
  children?: ReactNode;
}) {
  const toneClasses: Record<string, string> = {
    primary: "text-[var(--color-primary)] bg-[var(--color-primary)]/12",
    accent: "text-[var(--color-accent)] bg-[var(--color-accent)]/15",
    warning: "text-[var(--color-warning)] bg-[var(--color-warning)]/15",
    success: "text-[var(--color-success)] bg-[var(--color-success)]/15",
  };

  const sharedClassName = cn(
    "focus-ring flex flex-col gap-2 rounded-[var(--radius-card)] bg-[var(--color-surface)] p-4",
    href &&
      "transition-[transform,background-color] duration-[var(--duration-fast)] ease-out hover:-translate-y-0.5 hover:bg-[var(--color-surface-hover)] active:translate-y-0",
    className
  );

  const content = (
    <>
      <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", toneClasses[tone])}>
        <Icon size={16} aria-hidden="true" />
      </div>
      <div>
        <p className="text-stat-label">{label}</p>
        <p className="text-stat-value mt-0.5">{value}</p>
      </div>
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={sharedClassName}>
        {content}
      </Link>
    );
  }

  return <div className={sharedClassName}>{content}</div>;
}
