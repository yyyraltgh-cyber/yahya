#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# One-shot bootstrap: prepares everything needed to build the APK, including
# regenerating the Gradle wrapper JAR that could not be shipped offline.
# Safe to run repeatedly (idempotent). Run from the repo root.
# ---------------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Checking prerequisites"
command -v node >/dev/null || { echo "Node.js 18+ is required"; exit 1; }
command -v java >/dev/null || { echo "JDK 17 is required"; exit 1; }

echo "==> Installing npm dependencies (installs Capacitor CLI + Android platform pkg)"
npm install

WRAPPER_JAR="android/gradle/wrapper/gradle-wrapper.jar"
if [ ! -f "$WRAPPER_JAR" ]; then
  echo "==> Gradle wrapper JAR missing - regenerating"
  if command -v gradle >/dev/null 2>&1; then
    ( cd android && gradle wrapper --gradle-version 8.9 )
  else
    echo "    No system 'gradle' found. Downloading a temporary Gradle to bootstrap the wrapper."
    GRADLE_VER=8.9
    TMP="$(mktemp -d)"
    curl -fsSL "https://services.gradle.org/distributions/gradle-${GRADLE_VER}-bin.zip" -o "$TMP/gradle.zip"
    unzip -q "$TMP/gradle.zip" -d "$TMP"
    ( cd android && "$TMP/gradle-${GRADLE_VER}/bin/gradle" wrapper --gradle-version "$GRADLE_VER" )
    rm -rf "$TMP"
  fi
  echo "    Wrapper JAR generated at $WRAPPER_JAR"
else
  echo "==> Gradle wrapper JAR already present"
fi

echo "==> Bootstrap complete. Next: ./scripts/build-android.sh"
