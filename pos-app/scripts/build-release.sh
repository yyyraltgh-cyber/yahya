#!/usr/bin/env bash
# Build a signed release APK (uses the debug signing config by default;
# swap in a real upload keystore in android/app/build.gradle before publishing).
set -euo pipefail
cd "$(dirname "$0")/.."

npm install
CAPACITOR_BUILD=true npm run build
npx cap sync android
cd android
./gradlew assembleRelease
cd ..
mkdir -p release
cp android/app/build/outputs/apk/release/app-release.apk release/app-release.apk
echo "==> Done: release/app-release.apk"
