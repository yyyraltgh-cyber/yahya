import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor configuration for the Personal OS Android app.
 *
 * `webDir` points at the static export produced by
 * `CAPACITOR_BUILD=true next build` (Next.js writes it to ./out).
 * Run `npm run cap:build:android` to build the web bundle and sync it
 * into the native android/ project.
 */
const config: CapacitorConfig = {
  appId: "com.personalos.app",
  appName: "Personal OS",
  webDir: "out",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#0c1917",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0c1917",
    },
  },
};

export default config;
