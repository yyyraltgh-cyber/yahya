# Personal OS

A personal operating system for a life tended as one coherent whole — spiritual, daily,
relational — not a to-do list well-cleared. Built for an **Arabic-speaking Muslim audience**:
general productivity (tasks, notes, habits, routines, calendar, reviews, a knowledge base)
lives in the same data model as daily Islamic worship, not bolted on as a separate widget.

Native **RTL Arabic** interface (Tajawal for body text, Reem Kufi for headings), with the
**Garden of Life** — a slow, honest, illustrated growth visualization — as the product's one
deliberate visual signature. Governed by [`PERSONAL_OS_EXECUTIVE_CONSTITUTION.md`](./PERSONAL_OS_EXECUTIVE_CONSTITUTION.md):
no dark patterns, no addictive mechanics, no shame-based design, no decorative religious imagery.

---

## Stack

| Layer       | Tech                                              |
|-------------|----------------------------------------------------|
| Frontend    | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| Auth + DB   | Supabase (Postgres, Row Level Security, Auth)      |
| Mobile      | Capacitor 6 (Android WebView shell)                |
| Build       | Gradle 8.9, AGP 8.5, Kotlin 1.9, JDK 17            |

## What's actually in the app

- **Today / Dashboard** — the daily loop: Greeting → Garden → Focus → Daily Goal → Habits →
  Tasks → Progress → Achievements, plus smart suggestions and upcoming events.
- **Garden of Life** (`components/garden/`, `lib/garden/`) — a static-illustration growth
  visualization (9 stages, `public/garden/stages/`) driven by a documented formula
  (see [`lib/garden/FORMULA.md`](./lib/garden/FORMULA.md)) combining today's habits, unlocked
  achievements, and current streak. Never decorative, never punitive — see the Constitution §6.
- **Worship + growth content library** — ~280 curated items across spiritual, health, work,
  learning, and social habits, plus morning/evening/weekly/monthly routines
  (`lib/content/`), browsable via `/library`.
- **Gamification** (`components/gamification/`, `lib/gamification.ts`) — XP, streaks, and
  streak-freeze, deliberately kept as *light seasoning* behind the Garden, not the main driver
  (Constitution §10 / Product Evolution Report §11).
- **Tasks, Notes, Habits, Routines, Calendar, Life Areas, Reviews (daily/weekly/monthly),
  Knowledge Base, Statistics, Achievements, Notifications, Settings** — full CRUD, RLS-scoped
  per user.
- **PWA** — installable, offline-capable via a service worker with a Capacitor-aware guard
  (`components/sw-register.tsx`).
- Full Row Level Security across every table (`supabase/migrations/`).

## Project documents

- [`PERSONAL_OS_EXECUTIVE_CONSTITUTION.md`](./PERSONAL_OS_EXECUTIVE_CONSTITUTION.md) — the
  permanent product constitution. Governs; does not describe.
- [`lib/garden/FORMULA.md`](./lib/garden/FORMULA.md) — the Garden growth-level formula as a
  reviewable spec, not just a code comment.

---

## Getting started (web)

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL + anon key
npm run dev                  # http://localhost:3000
```

### Database

Apply the migrations under `supabase/migrations/` in order (0001 → 0006) via the Supabase SQL
editor or the CLI (`supabase db push`). They create the full schema — profiles, tasks, notes,
habits, routines, calendar events, life areas, reviews, knowledge base, the content library, and
gamification tables — with RLS policies and triggers throughout.

---

## Android build

Prerequisites: **Node 18+, JDK 17, Android SDK** (platform 34, build-tools 34), and internet
access on first run.

```bash
./scripts/build-android.sh      # → release/app.apk  (debug-signed)
./scripts/build-release.sh      # → release/app-release.apk
```

Or step by step:

```bash
npm install
CAPACITOR_BUILD=true npm run build   # static export → ./out
npx cap sync android                 # copy bundle into android/
cd android
./gradlew assembleDebug              # → app/build/outputs/apk/debug/app-debug.apk
```

Open `android/` in **Android Studio** to build/run on a device or emulator.

> **Note on the Gradle wrapper jar:** `android/gradle/wrapper/gradle-wrapper.jar` is regenerated
> automatically the first time you open the project in Android Studio, or by running
> `gradle wrapper --gradle-version 8.9` in `android/`. See `android/gradle/wrapper/README.txt`.

> **Note on the service worker in the Android shell:** `components/sw-register.tsx` guards
> service-worker registration behind a `"Capacitor" in window` runtime check. This guard has
> already caused one real "rebuilt but nothing changed" debugging session — verify it still
> fires correctly after any Capacitor or Next.js upgrade before shipping a build.

---

## Project layout

```
.
├── app/                      # Next.js App Router pages
│   ├── (auth)/                # login + signup
│   ├── dashboard/              # Today / daily loop
│   ├── tasks/ notes/ habits/   # core CRUD features
│   ├── routines/ calendar/     # scheduled structure
│   ├── areas/ reviews/         # life areas + reflection
│   ├── knowledge/ library/     # knowledge base + content library
│   ├── statistics/ achievements/ notifications/ search/ settings/
│   └── onboarding/
├── components/
│   ├── garden/                 # Garden of Life illustration + effects
│   ├── gamification/            # XP, streaks, streak-freeze
│   ├── today/                   # Today-screen section components
│   ├── layout/ settings/ ui/    # shell, settings widgets, design-system primitives
│   └── sw-register.tsx          # Capacitor-aware service-worker guard
├── lib/
│   ├── garden/                  # growth formula, stage assets, FORMULA.md
│   ├── content/                 # habits/routines/projects content library
│   ├── engine/ suggestions/      # daily-goal, priority, and suggestion engines
│   ├── i18n/                     # ar/en dictionaries, RTL direction handling
│   ├── supabase/ types/          # Supabase clients + generated DB types
│   └── gamification.ts
├── supabase/migrations/         # SQL schema + RLS, applied in order
├── android/                     # Capacitor Android project (Gradle)
├── scripts/                     # build + asset-generation scripts
├── capacitor.config.ts
└── PERSONAL_OS_EXECUTIVE_CONSTITUTION.md
```

## Environment variables

See `.env.example` (dev) and `.env.production.example` (prod). Required:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Server-only:
`SUPABASE_SERVICE_ROLE_KEY`.

## License

Proprietary — all rights reserved.
