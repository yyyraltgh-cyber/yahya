#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# End-to-end Android build for Personal OS.
# Requires: Node 18+, JDK 17, Android SDK (platform 34, build-tools 34.x),
# and internet access for the first run (npm + Gradle downloads).
# ---------------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> 1/5 Installing npm dependencies"
npm install

echo "==> 2/5 Building the static web bundle (Next.js export)"
CAPACITOR_BUILD=true npm run build

echo "==> 3/5 Syncing the web bundle into the native Android project"
npx cap sync android

echo "==> 4/5 Assembling the debug APK"
cd android
if [ ! -f gradle/wrapper/gradle-wrapper.jar ]; then
  echo "    gradle-wrapper.jar missing - regenerating via system Gradle"
  gradle wrapper --gradle-version 8.9
fi
./gradlew assembleDebug

echo "==> 5/5 Copying APK to release/app.apk"
cd ..
mkdir -p release
cp android/app/build/outputs/apk/debug/app-debug.apk release/app.apk
echo "==> Done: release/app.apk"
