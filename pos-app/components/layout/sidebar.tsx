"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet } from "@/components/ui/sheet";
import { useTranslation } from "@/lib/i18n/locale-context";
import type { TranslationKey } from "@/lib/i18n/translate";
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Repeat,
  Calendar,
  ListChecks,
  Layers,
  Library,
  BookOpen,
  BarChart3,
  Search,
  Settings,
  Trophy,
  MoreHorizontal,
} from "lucide-react";

const primary = [
  { href: "/dashboard", labelKey: "nav.dashboard" as TranslationKey, icon: LayoutDashboard },
  { href: "/tasks", labelKey: "nav.tasks" as TranslationKey, icon: CheckSquare },
  { href: "/notes", labelKey: "nav.notes" as TranslationKey, icon: FileText },
  { href: "/habits", labelKey: "nav.habits" as TranslationKey, icon: Repeat },
  { href: "/routines", labelKey: "nav.routines" as TranslationKey, icon: ListChecks },
  { href: "/calendar", labelKey: "nav.calendar" as TranslationKey, icon: Calendar },
];

const secondary = [
  { href: "/library", labelKey: "nav.library" as TranslationKey, icon: Library },
  { href: "/achievements", labelKey: "nav.achievements" as TranslationKey, icon: Trophy },
  { href: "/areas", labelKey: "nav.areas" as TranslationKey, icon: Layers },
  { href: "/reviews", labelKey: "nav.reviews" as TranslationKey, icon: BookOpen },
  { href: "/knowledge", labelKey: "nav.knowledge" as TranslationKey, icon: BookOpen },
  { href: "/statistics", labelKey: "nav.statistics" as TranslationKey, icon: BarChart3 },
  { href: "/search", labelKey: "nav.search" as TranslationKey, icon: Search },
  { href: "/settings", labelKey: "nav.settings" as TranslationKey, icon: Settings },
];

// Items shown directly in the mobile bottom bar (space-constrained — four
// direct destinations plus one "More" trigger). Everything in `secondary`
// above previously had NO path to reach it at all on mobile — the fifth
// slot was a direct Settings shortcut mislabeled "More," so Library,
// Achievements (unless found via the Topbar's XP link), Areas, Reviews,
// Knowledge, and Statistics were simply unreachable on a phone. The More
// sheet below is the actual fix, not a relabeling.
const mobileItems = [
  { href: "/dashboard", labelKey: "nav.home" as TranslationKey, icon: LayoutDashboard },
  { href: "/tasks", labelKey: "nav.tasks" as TranslationKey, icon: CheckSquare },
  { href: "/habits", labelKey: "nav.habits" as TranslationKey, icon: Repeat },
  { href: "/calendar", labelKey: "nav.calendar" as TranslationKey, icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [moreOpen, setMoreOpen] = useState(false);

  const item = (
    { href, labelKey, icon: Icon }: { href: string; labelKey: TranslationKey; icon: typeof LayoutDashboard },
    active: boolean
  ) => (
    <Link
      key={href}
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors duration-[var(--duration-fast)]",
        active
          ? "bg-[var(--color-surface-hover)] text-[var(--color-text)]"
          : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
      )}
    >
      {active && (
        <span
          className="absolute inset-y-1 start-0 w-0.5 rounded-full bg-[var(--color-primary)]"
          aria-hidden="true"
        />
      )}
      <Icon size={18} aria-hidden="true" className={active ? "text-[var(--color-primary)]" : ""} />
      {t(labelKey)}
    </Link>
  );

  const isMoreActive = secondary.some((l) => pathname.startsWith(l.href));

  return (
    <>
      {/* Desktop / tablet vertical rail */}
      <nav className="hidden h-full w-56 shrink-0 flex-col gap-1 overflow-y-auto border-r border-[var(--color-border)] p-4 sm:flex">
        <Link
          href="/dashboard"
          className="focus-ring mb-4 flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-1 -mx-2"
          aria-label={t("nav.appName")}
        >
          <div aria-hidden="true" className="h-8 w-8 rounded-[var(--radius-md)] bg-[var(--color-primary)] flex items-center justify-center font-bold text-white">
            P
          </div>
          <span className="font-display font-semibold">{t("nav.appName")}</span>
        </Link>

        {primary.map((l) => item(l, pathname.startsWith(l.href)))}

        <p className="text-stat-label mb-1 mt-4 px-3">{t("nav.moreSection")}</p>
        {secondary.map((l) => item(l, pathname.startsWith(l.href)))}
      </nav>

      {/* Mobile bottom navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex border-t border-[var(--color-border)] bg-[var(--color-surface)] sm:hidden"
        style={
          {
            zIndex: "var(--z-nav)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          } as CSSProperties
        }
      >
        {mobileItems.map(({ href, labelKey, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="focus-ring flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium"
            >
              <span
                className={cn(
                  "flex h-7 w-11 items-center justify-center rounded-full transition-colors duration-[var(--duration-fast)]",
                  active ? "bg-[var(--color-primary)]/15" : ""
                )}
              >
                <Icon
                  size={20}
                  aria-hidden="true"
                  className={cn(
                    "transition-colors duration-[var(--duration-fast)]",
                    active ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"
                  )}
                />
              </span>
              <span className={active ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"}>
                {t(labelKey)}
              </span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          aria-expanded={moreOpen}
          aria-haspopup="dialog"
          className="focus-ring flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium"
        >
          <span
            className={cn(
              "flex h-7 w-11 items-center justify-center rounded-full transition-colors duration-[var(--duration-fast)]",
              isMoreActive ? "bg-[var(--color-primary)]/15" : ""
            )}
          >
            <MoreHorizontal
              size={20}
              aria-hidden="true"
              className={isMoreActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"}
            />
          </span>
          <span className={isMoreActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"}>
            {t("nav.more")}
          </span>
        </button>
      </nav>

      <Sheet open={moreOpen} onClose={() => setMoreOpen(false)} title={t("nav.moreSection")}>
        <div className="grid grid-cols-3 gap-3">
          {secondary.map(({ href, labelKey, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMoreOpen(false)}
                aria-current={active ? "page" : undefined}
                className="focus-ring flex flex-col items-center gap-2 rounded-[var(--radius-md)] p-3 text-center transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface-hover)]"
              >
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full",
                    active ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)]" : "bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
                  )}
                >
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="text-xs font-medium">{t(labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </Sheet>
    </>
  );
}
