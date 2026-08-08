# COMPLETE BUILD CHECKLIST — Personal OS Android

Everything needed to turn this repository into an installable `app.apk`.
Every file is already generated and cross-verified. On the first machine with
Android Studio (or JDK 17 + Android SDK) and internet, the steps below produce
the APK with **zero manual coding**.

---

## 0. One-time prerequisites (install once per machine)

- [ ] **Node.js 18.18+** — https://nodejs.org
- [ ] **JDK 17** — Android Studio bundles one, or install Temurin 17
- [ ] **Android Studio** (Hedgehog+ recommended) — https://developer.android.com/studio
  - Includes: Android SDK, SDK Platform 34, Build-Tools 34.x, Platform-Tools, Gradle
- [ ] Accept SDK licenses: `yes | sdkmanager --licenses` (or via Studio's SDK Manager)

Set environment (if building from CLI without Studio):
```bash
export ANDROID_HOME="$HOME/Android/Sdk"      # adjust to your install
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
```

---

## 1. Fastest path — fully automated

```bash
cd personal-os
./scripts/bootstrap.sh          # installs deps + regenerates gradle-wrapper.jar
./scripts/build-android.sh      # builds web bundle, syncs, assembles APK
# → APK at: release/app.apk
```

For a release-type build:
```bash
./scripts/build-release.sh      # → release/app-release.apk
```

---

## 2. Android Studio path (GUI, zero terminal)

1. [ ] `npm install`
2. [ ] `cp .env.example .env.local` and fill in Supabase URL + anon key
3. [ ] `CAPACITOR_BUILD=true npm run build` (creates `./out`)
4. [ ] `npx cap sync android`
5. [ ] Open the `android/` folder in **Android Studio**
   - Studio auto-regenerates `gradle-wrapper.jar` and downloads Gradle 8.9
   - Studio auto-creates `local.properties` pointing at your SDK
6. [ ] **Build → Build Bundle(s)/APK(s) → Build APK(s)**
7. [ ] APK appears at `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 3. Manual CLI path (step by step)

```bash
# 3.1 Web deps + static export
npm install
CAPACITOR_BUILD=true npm run build        # → ./out

# 3.2 Sync into native project
npx cap sync android

# 3.3 Regenerate wrapper jar (only if missing)
cd android
gradle wrapper --gradle-version 8.9       # skip if jar already present

# 3.4 Assemble
./gradlew assembleDebug                    # debug APK
./gradlew assembleRelease                  # release APK (debug-signed by default)

# 3.5 Collect
cd ..
mkdir -p release
cp android/app/build/outputs/apk/debug/app-debug.apk release/app.apk
```

---

## 4. Install on a device

```bash
adb install -r release/app.apk
```
Or drag the APK onto a running emulator.

---

## 5. Supabase backend setup (required for auth + data)

1. [ ] Create a project at https://supabase.com
2. [ ] Open the SQL editor and run `supabase/migrations/0001_init.sql`
       (creates tables, RLS policies, triggers)
3. [ ] Copy Project URL + anon key into `.env.local`
4. [ ] In Auth → URL config, add your redirect URL
       (`NEXT_PUBLIC_SITE_URL/auth/callback`)

---

## 6. Signing for Google Play (before public release)

The project ships with a real debug keystore so debug **and** release builds
are signed and installable immediately. Before publishing:

1. [ ] Generate an upload keystore:
   ```bash
   keytool -genkeypair -v -keystore upload-keystore.jks \
     -keyalg RSA -keysize 2048 -validity 10000 -alias upload
   ```
2. [ ] Replace the `signingConfigs.debug` reference in the `release` block of
       `android/app/build.gradle` with a new `signingConfigs.release` pointing
       at `upload-keystore.jks`, and load its credentials from
       `~/.gradle/gradle.properties` (never commit them).
3. [ ] `./gradlew bundleRelease` → `.aab` for Play Store upload.

---

## 7. Verification status (already done during generation)

- [x] All XML files parse
- [x] All JSON files parse
- [x] All `@/…` TypeScript imports resolve to real files
- [x] `appId` / `namespace` consistent (`com.personalos.app`) across all configs
- [x] `webDir` consistent (`out`)
- [x] Every manifest-referenced resource exists (icons, splash, activity, keystore)
- [x] All 26 icon/splash PNGs valid at correct dimensions
- [x] Debug keystore is a valid RSA keystore
- [x] Gradle module wiring intact (settings + capacitor.settings)
- [x] ESLint, error/loading/not-found boundaries, auth callback, robots, sitemap present

## The only artifact not producible offline

`android/gradle/wrapper/gradle-wrapper.jar` — a ~60 KB binary that must be
fetched from Gradle's servers. `scripts/bootstrap.sh` downloads/regenerates it
automatically, and Android Studio does so on first sync. No other file is
missing.
