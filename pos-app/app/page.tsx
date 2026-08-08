"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/locale-context";

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-14 w-14 rounded-[var(--radius-card)] bg-[var(--color-primary)] flex items-center justify-center text-2xl font-bold">
          P
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">{t("nav.appName")}</h1>
        <p className="max-w-md text-[var(--color-text-muted)]">{t("misc.tagline")}</p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="focus-ring rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2.5 font-medium transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-primary-hover)]"
        >
          {t("auth.signIn")}
        </Link>
        <Link
          href="/signup"
          className="focus-ring rounded-[var(--radius-md)] border border-[var(--color-border)] px-5 py-2.5 font-medium transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface-hover)]"
        >
          {t("auth.createAccount")}
        </Link>
      </div>
    </main>
  );
}
