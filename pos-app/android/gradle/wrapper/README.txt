gradle-wrapper.jar
==================

This binary file is normally committed alongside the wrapper scripts, but it
could not be generated in the offline build environment (no network access to
download it, and no local Gradle installation to run `gradle wrapper`).

To restore it on any machine that has Gradle installed OR internet access,
run ONE of the following from the android/ directory:

  # Option A - you have Gradle installed locally:
  gradle wrapper --gradle-version 8.9

  # Option B - Android Studio:
  Just open the android/ project in Android Studio. It detects the missing
  wrapper jar and regenerates it automatically on first sync.

After that, ./gradlew assembleDebug will work normally.
