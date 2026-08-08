"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthGuard } from "@/lib/use-auth-guard";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { OnboardingFlow } from "./onboarding-flow";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuthGuard();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.onboarded) {
          router.replace("/dashboard");
          return;
        }
        setReady(true);
      });
  }, [user, router]);

  if (loading || !user || !ready) return <LoadingScreen />;

  return <OnboardingFlow userId={user.id} />;
}
