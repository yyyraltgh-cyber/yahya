"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/locale-context";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const supabase = createClient();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // /auth/callback was removed early in this project (a server route,
        // incompatible with static export) — redirect to the real /login
        // page instead. Confirming the email itself happens server-side in
        // Supabase regardless of where the link redirects; the user just
        // needs a page that actually exists to land on afterward.
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/login`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div className="max-w-sm">
          <h1 className="text-page-title mb-2">{t("auth.checkInbox")}</h1>
          <p className="text-[var(--color-text-muted)]">{t("auth.confirmationSent", { email })}</p>
          <Link href="/login" className="mt-4 inline-block text-[var(--color-primary)] hover:underline">
            {t("auth.backToSignIn")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <h1 className="text-page-title mb-6">{t("auth.createAccount")}</h1>

          <label className="mb-1 block text-sm text-[var(--color-text-muted)]">{t("auth.email")}</label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />

          <label className="mb-1 block text-sm text-[var(--color-text-muted)]">{t("auth.password")}</label>
          <Input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />

          {error && <p className="mb-4 text-sm text-[var(--color-danger)]">{error}</p>}

          <Button type="submit" loading={loading} className="w-full">
            {t("auth.createAccount")}
          </Button>

          <p className="mt-4 text-center text-sm text-[var(--color-text-muted)]">
            {t("auth.haveAccount")}{" "}
            <Link href="/login" className="text-[var(--color-primary)] hover:underline">
              {t("auth.signIn")}
            </Link>
          </p>
        </form>
      </Card>
    </main>
  );
}
