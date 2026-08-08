package com.personalos.app

import com.getcapacitor.BridgeActivity

/**
 * Entry activity for Personal OS. Extends Capacitor's BridgeActivity,
 * which hosts the WebView and loads the bundled web app from
 * android/app/src/main/assets/public (synced via `npx cap sync`).
 */
class MainActivity : BridgeActivity()
