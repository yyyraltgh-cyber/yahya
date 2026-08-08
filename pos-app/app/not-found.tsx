"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/locale-context";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="text-[var(--color-text-muted)]">{t("misc.notFoundBody")}</p>
      <Link
        href="/"
        className="focus-ring rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2.5 font-medium transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-primary-hover)]"
      >
        {t("misc.goHome")}
      </Link>
    </main>
  );
}
