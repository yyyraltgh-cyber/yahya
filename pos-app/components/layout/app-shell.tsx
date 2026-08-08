import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { PageTransition } from "@/components/layout/page-transition";
import { WorldAmbient } from "@/components/layout/world-ambient";
import { WorldSurface } from "@/components/layout/world-surface";
import { GamificationProvider } from "@/components/gamification/gamification-context";
import { ToastProvider } from "@/components/ui/toast-context";

/**
 * Standard authenticated page shell: responsive sidebar + top bar + content.
 * Layer order (Release 2C, Objective 1): Environment (WorldAmbient) →
 * World Surface (the grounded plane content sits on) → Interactive
 * Surface (PageTransition wraps the actual per-route page, which is
 * built from Cards). Environment and World Surface both persist across
 * navigation — only the innermost content re-enters per route, which is
 * what makes screen changes read as moving through one place rather than
 * opening separate pages (Objective 4).
 */
export function AppShell({
  title,
  userId,
  children,
}: {
  title: string;
  userId: string;
  children: React.ReactNode;
}) {
  return (
    <GamificationProvider userId={userId}>
      <ToastProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1">
            <Topbar title={title} />
            <main className="p-6 pb-24 sm:pb-6 main-safe-area-bottom">
              <WorldAmbient userId={userId}>
                <WorldSurface>
                  <PageTransition>{children}</PageTransition>
                </WorldSurface>
              </WorldAmbient>
            </main>
          </div>
        </div>
      </ToastProvider>
    </GamificationProvider>
  );
}
