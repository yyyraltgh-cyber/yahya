import type { Metadata, Viewport } from "next";
import { Tajawal, Reem_Kufi } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/theme-script";
import { ServiceWorkerRegister } from "@/components/sw-register";
import { LocaleProvider } from "@/lib/i18n/locale-context";

// Body/UI face: warm, humanist, highly legible Arabic sans with full Latin
// support for the English toggle. Loaded with Arabic + Latin subsets so
// both locales render correctly without a flash of unstyled/fallback text.
const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

// Display face for headings and celebratory moments only (level-up,
// achievement titles, page titles) — a geometric face inspired by Kufic
// calligraphy, used deliberately sparingly per the app's restrained tone.
const reemKufi = Reem_Kufi({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-reem-kufi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Personal OS",
  description: "Your personal operating system for tasks, notes, habits, routines, and more.",
  applicationName: "Personal OS",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Personal OS",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0c1917",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${reemKufi.variable}`}>
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased">
        <LocaleProvider>
          {children}
          <ServiceWorkerRegister />
        </LocaleProvider>
      </body>
    </html>
  );
}
