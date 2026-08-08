# بناء تطبيق Personal OS عبر GitHub (Codespaces أو Actions)

هذه البيئة الحالية لا تستطيع بناء APK (لا إنترنت ولا Android SDK). لكن GitHub
يوفّر الاثنين مجانًا. أمامك طريقتان — **الطريقة (ب) هي الأسهل والأنصح.**

---

## الخطوة صفر: ارفع المشروع إلى GitHub

1. فُكّ ضغط `personal-os-android.zip`.
2. أنشئ مستودعًا (repository) جديدًا على GitHub.
3. ارفع محتويات مجلد `pos-app` إلى المستودع (عبر واجهة GitHub أو الأوامر):
   ```bash
   git init
   git add .
   git commit -m "Personal OS"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```

---

## الطريقة (أ): البناء داخل Codespace يدويًا

1. في صفحة المستودع اضغط زر **Code** الأخضر ← تبويب **Codespaces** ← **Create codespace**.
2. المشروع يحتوي على ملف `.devcontainer/devcontainer.json` يثبّت **Java 17 + Android SDK**
   تلقائيًا عند فتح الـ Codespace (انتظر حتى يكتمل الإعداد أول مرة).
3. داخل الطرفية (terminal) شغّل:
   ```bash
   npm install
   CAPACITOR_BUILD=true npm run build
   npx cap sync android
   cd android
   gradle wrapper --gradle-version 8.9   # يولّد wrapper jar الناقص
   ./gradlew assembleDebug
   ```
4. ملف الـ APK يظهر في:
   `android/app/build/outputs/apk/debug/app-debug.apk`
5. حمّله من شجرة الملفات في Codespaces (كليك يمين ← Download).

> يمكنك اختصار الخطوات 3 بـ: `./scripts/bootstrap.sh && ./scripts/build-android.sh`
> وسينتج `release/app.apk` مباشرة.

---

## الطريقة (ب): GitHub Actions يبني الـ APK تلقائيًا ☁️ (الأنصح)

المشروع يحتوي على `.github/workflows/build-android.yml` جاهز. بمجرد رفع الكود:

1. اذهب إلى تبويب **Actions** في المستودع.
2. إن طُلب منك، فعّل تشغيل الـ workflows.
3. الـ workflow يعمل تلقائيًا عند كل `push` إلى `main`، أو شغّله يدويًا من
   زر **Run workflow**.
4. GitHub يبني الـ APK على خوادمه (تثبيت Node + Java + Android SDK تلقائيًا).
5. بعد انتهاء البناء (بضع دقائق):
   - نزّل الـ APK من قسم **Artifacts** في صفحة التشغيل، أو
   - من قسم **Releases** في المستودع (يُرفق تلقائيًا).

### إعداد متغيّرات Supabase (اختياري لكنه مهم لعمل التطبيق فعليًا)

في المستودع: **Settings ← Secrets and variables ← Actions ← New repository secret**،
وأضف:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

بدونها سيُبنى التطبيق لكن تسجيل الدخول وحفظ البيانات لن يعمل حتى تضيفها.

---

## أيّهما أختار؟

| | Codespace (أ) | Actions (ب) |
|---|---|---|
| يحتاج جهازًا قويًا | لا (كله في السحابة) | لا |
| APK جاهز تلقائيًا | تشغّله يدويًا | نعم، عند كل push |
| مناسب للتجربة السريعة | ✅ | — |
| مناسب للإصدارات المتكررة | — | ✅ |

**الأنصح: الطريقة (ب)** لأنها لا تتطلب أي أوامر — فقط ارفع الكود ونزّل الـ APK.
