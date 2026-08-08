# Add project specific ProGuard rules here.
# Capacitor + WebView reflection safety.
-keep public class com.getcapacitor.** { *; }
-keep public class com.personalos.app.** { *; }
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
