"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/locale-context";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <h1 className="text-page-title mb-6">{t("auth.signIn")}</h1>

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />

          {error && <p className="mb-4 text-sm text-[var(--color-danger)]">{error}</p>}

          <Button type="submit" loading={loading} className="w-full">
            {t("auth.signIn")}
          </Button>

          <p className="mt-4 text-center text-sm text-[var(--color-text-muted)]">
            {t("auth.noAccount")}{" "}
            <Link href="/signup" className="text-[var(--color-primary)] hover:underline">
              {t("auth.createOne")}
            </Link>
          </p>
        </form>
      </Card>
    </main>
  );
}
