"use client";

import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n/locale-context";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-page-title">{t("misc.errorTitle")}</h1>
      <p className="max-w-md text-[var(--color-text-muted)]">{t("misc.errorBody")}</p>
      <button
        onClick={reset}
        className="focus-ring rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2.5 font-medium transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-primary-hover)]"
      >
        {t("common.tryAgain")}
      </button>
    </main>
  );
}
