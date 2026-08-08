"use client";

import { useEffect } from "react";

/**
 * Registers the PWA service worker — but ONLY for real web/browser
 * visits, never inside the Capacitor native Android app.
 *
 * Root cause of repeated "rebuilt and reinstalled but nothing changed"
 * reports: the app is fully bundled inside the APK already (it doesn't
 * need Cache Storage API to work offline), so the service worker served
 * no purpose here — it only added a second, independent caching layer
 * that could keep serving old CSS/JS after a fresh install, no matter
 * how many times the APK itself was rebuilt correctly. Capacitor injects
 * `window.Capacitor` at runtime, which is what we gate on below.
 *
 * This also actively unregisters and purges any service worker + cache
 * left over on a device from earlier testing (before this fix existed),
 * so devices already affected self-heal on the very next app launch —
 * no manual cache-clearing or uninstall ritual required going forward.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    const isNativeApp = typeof window !== "undefined" && "Capacitor" in window;

    if (isNativeApp) {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((reg) => reg.unregister());
        });
      }
      if ("caches" in window) {
        caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
      }
      return;
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration failures are non-fatal.
      });
    }
  }, []);
  return null;
}
