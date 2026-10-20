Eye of Chaos / VoidOS v2.0.0 — إعداد Cordova لنظام Android
الملكية والتطوير: Void Walker.

هذه مجلدات مشروع Cordova جاهزة للتحضير والبناء، لكنها ليست APK مبنية مسبقًا. يلزم Node.js وnpm وCordova وAndroid SDK/JDK متوافقان مع نسخة cordova-android.

خطوات البناء من داخل مجلد cordova-project:
1) npm install
2) npx cordova platform add android  (إذا لم يظهر Android ضمن المنصات)
3) npx cordova prepare android
4) npx cordova build android --debug

المسار المتوقع بعد نجاح البناء:
platforms/android/app/build/outputs/apk/debug/app-debug.apk

إضافة cordova-plugin-inappbrowser مضمّنة في الإعداد. يستخدم VoidBrowserX هذه الإضافة لفتح المواقع التي تمنع تضمينها داخل iframe ضمن نافذة متصفح داخلية في تطبيق Cordova. إذا لم تعمل الإضافة، يظل خيار window.open متاحًا بحسب بيئة التشغيل.

ملاحظات:
- هذا التطبيق حاوية Android مبنية بـ Cordova حول واجهة ويب؛ ليس نظام تشغيل Android بديلًا ولا يملك صلاحيات النظام تلقائيًا.
- إعدادات الشبكة تسمح بطلبات HTTPS، لكن سياسات CORS لدى مزودي البحث تبقى سارية.
- لم يُنفذ بناء APK في عملية إعداد هذه الحزمة، لذلك يجب تنفيذ الخطوات على جهازك للتحقق من توافق بيئة Android SDK/JDK المثبتة لديك.
- لا تضع مفاتيح توقيع الإنتاج أو كلمات مرورها داخل المستودع أو ZIP.
