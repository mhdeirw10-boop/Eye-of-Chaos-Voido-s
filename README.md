# Eye of Chaos / VoidOS — الإصدار 2.0.0

منظومة ويب محلية أولًا تجمع واجهة VoidOS التجريبية، تطبيقات Void، أرشيف عالم عين الفوضى، وطبقة **CHAOS SYSTEM** المشتركة بين التطبيقات، مع نواة VoidOS مركزية وسجل خدمات وموجّه نوايا عربي.

> **الدقة التقنية:** هذا مشروع ويب/‏PWA وليس نظام أندرويد أصليًا. طبقة CHAOS المشتركة هي محرك أوامر محلي وواجهة ربط بين التطبيقات، وليست نموذجًا لغويًا مستقلًا ولا تمتلك صلاحيات النظام أو وصولًا تلقائيًا إلى ملفات الهاتف. لا يوجد خادم خلفي أو مزامنة بين الأجهزة.

## البحث الموحّد

حقل البحث في الشاشة الرئيسية يبحث في التطبيقات المسجلة وبعض البيانات المحلية (الملاحظات والمهام والأحداث والإشارات المرجعية وسجل المتصفح وذاكرة بحث CHAOS). عند الضغط على Enter، يوجّه الطلب غير المطابق إلى VoidBrowserX ويشغّل البحث الداخلي. فهرسة الملفات تقتصر على ما تسمح التطبيقات بمعرفته؛ لا يستطيع المتصفح مسح كامل ملفات Android تلقائيًا.

## التطبيقات المدمجة

- `apps/voidtube/` — VoidTube: اختيار فيديو محلي وتشغيله وحفظ تفضيلات محلية؛ الرفع والمشاركة العامة تحتاج إلى خادم.
- `apps/void-store/` — Void Store: فهرس تطبيقات تجريبي وروابط تشغيل التطبيقات الموجودة داخل المنظومة؛ لا يحتوي حزم APK فعلية للتنزيل.
- `apps/void-notes/` — Void Notes: ملاحظات مع البحث والوسوم والتعديل والحذف والتصدير والاستيراد.
- `apps/void-calculator/` — Void Calculator: عمليات أساسية وأقواس ونسبة مئوية وجذر وتربيع وسجل جلسة.
- `apps/void-planner/` — Void Planner: مهام مع مواعيد وأولويات وفلاتر وحالة إنجاز.
- `apps/void-files/` — Void Files: معاينة ملفات يختارها المستخدم ونسخ احتياطي للبيانات التي يسمح بها المتصفح؛ لا يستعرض كل تخزين الهاتف.
- `apps/void-calendar/` — Void Calendar: تقويم شهري وأحداث محلية.
- `apps/void-browserx/` — VoidBrowserX v2.0: بحث متعدد المصادر عبر `webSearch.js`، ذاكرة نتائج محلية عبر `webMemory.js`، تبويبات وإشارات مرجعية وسجل وتوجيه للبحث من CHAOS SYSTEM، وفتح المواقع داخل InAppBrowser عند تجهيز Cordova.
- `apps/void-manager/` — مدير التطبيقات: تفعيل/تعطيل التطبيقات الإضافية، إدارة منح الصلاحيات، وفحص وحدات النواة.
- `terminal/index.html` — طبقة الطرفية الفعلية. الملف القديم `terminal.html` صار مدخل توافق يحوّل إلى المجلد الجديد.
- `settings.html` — إعدادات النظام وإدارة الذاكرة والنسخ الاحتياطية والتشخيص.
- `chapters.html` و`characters.html` — أرشيف الفصول والشخصيات.

## طبقة CHAOS SYSTEM المشتركة

يُحمّل `js/chaos-layer.js` داخل الصفحات والتطبيقات المدمجة، بينما أزيلت النافذة العائمة من الشاشة الرئيسية لتجنب التكرار مع رمز الطرفية في شريط التطبيقات. افتح الطرفية من رمز **⌘** في الشريط السفلي، أو افتح واجهة CHAOS داخل تطبيق يدعمها. وقد يعمل الاختصار `Alt+Shift+C` أو `Ctrl+Shift+C` بحسب المتصفح.

- واجهة أوامر موحّدة وسجل أوامر ونشاط مشتركًا.
- ذاكرة محلية مشتركة يمكن حفظ العناصر واسترجاعها منها.
- إنشاء ملاحظة في Void Notes، أو مهمة في Void Planner، أو حدث في Void Calendar من أي تطبيق.
- فتح التطبيقات عبر مشغّل VoidOS عند تشغيلها داخل نافذة النظام.
- إشارات نشاط عند تحديث بيانات بعض التطبيقات، وواجهة `window.CHAOS` التي يمكن للتطبيقات استخدامها للتكامل.
- موجّه نوايا يرسل العمليات الرياضية إلى Void Calculator، وطلبات تنزيل/البحث عن التطبيقات إلى Void Store. لا يستخدم محرك الحاسبة `eval` أو `Function`.

### أوامر الطبقة المشتركة

- `help` — عرض الأوامر.
- `status` — حالة الطبقة والتخزين.
- `time` — الوقت المحلي.
- `open notes` أو `open calculator` أو `open planner` أو `open calendar` أو `open files` أو `open store` أو `open tube` أو `open terminal` أو `open settings`.
- `note نص الملاحظة` — إنشاء ملاحظة في Void Notes.
- `task نص المهمة` — إضافة مهمة إلى Void Planner.
- `event 2026-10-20 | عنوان الحدث` — إضافة حدث إلى التقويم (غيّر التاريخ حسب الحاجة).
- `calc (12+3)*4` أو `احسب 12+3` — يفتح Void Calculator ويُمرّر العملية إليها.
- `remember معلومة` و`recall كلمة` — حفظ معلومة في ذاكرة CHAOS المشتركة والبحث عنها.
- `activity` — آخر الأحداث المسجلة.

تظل واجهة الطرفية المتقدمة في `terminal/index.html` متاحة للأوامر والذاكرة والسرد الخاص بـ CHAOS SYSTEM؛ أما `terminal.html` فهو مسار توافق قديم. طبقة الربط المشتركة لا تستبدل نواة الطرفية ولا تدّعي أن كل أوامر الطرفية الأصلية أصبحت قابلة للتنفيذ من كل تطبيق؛ إنها توفر واجهة مشتركة وخدمات محلية عملية.

## ملفات مهمة

- `index.html` — واجهة الهاتف ومشغّل التطبيقات والتطبيقات الحديثة.
- `js/kernel/` — النواة الأساسية، مصنّف النوايا، سجل الخدمات، موجّه المهام، ناقل الأحداث والنتائج والتشخيص، مدير التطبيقات ومدير الصلاحيات وسياسة روابط المتصفح.
- `js/chaos-layer.js` — واجهة CHAOS المشتركة التي تتصل بالنواة وخدماتها.
- `terminal.html` و`js/brain/` — الطرفية ومحركاتها وذاكرتها الأصلية.
- `js/settingsEnhancements.js` — أدوات إعدادات الذاكرة والنسخ الاحتياطية.
- `manifest.webmanifest` و`sw.js` — بيانات PWA والتخزين المؤقت للملفات.
- `standalone-packages/` — أرشيفا ZIP الأصليان لـ VoidTube وVoid Store للحفاظ على النسخ المستقلة.

## التخزين والخصوصية

- ملاحظات Void Notes: `voidos_notes_v1`.
- مهام Void Planner: `voidos_planner_tasks_v1`.
- أحداث Void Calendar: `voidos_calendar_events_v1`.
- ذاكرة طبقة CHAOS المشتركة: `voidos_chaos_layer_memory_v1`.
- سجل النشاط: `voidos_chaos_layer_activity_v1`.
- سجل الأوامر: `voidos_chaos_layer_commands_v1`.
- البيانات محلية على أصل المتصفح نفسه. تغيير النطاق أو الانتقال من `file://` إلى HTTPS لا ينقل البيانات تلقائيًا؛ استخدم النسخ الاحتياطي عند الحاجة.
- التخزين المحلي ليس مخزن أسرار مشفرًا. لا تحفظ كلمات مرور أو معلومات حساسة.

## التشغيل والاختبار

- نسخة Cordova جاهزة مبدئيًا موجودة في `cordova-project/` مع `config.xml` وملفات `www/` وإضافة InAppBrowser. لم تُبنَ APK تلقائيًا ضمن هذه الحزمة.
- في Cordova: نفّذ `npm install` ثم `npx cordova platform add android` (إذا لم تكن المنصة موجودة) ثم `npx cordova build android`. راجع `cordova-project/README_CORDOVA_AR.txt`.
- بحث VoidBrowserX يستخدم واجهات عامة متاحة من المتصفح وذاكرة نتائج محلية محدودة؛ لا يملك خادم زحف يفهرس الإنترنت كاملًا، ولا يمكنه تجاوز CORS أو سياسات تضمين المواقع.

يمكن تشغيل اختبارات النواة والأمان والمحركات من مجلد المشروع عبر Node.js: `node tests/kernel-tests.cjs` و`node tests/security-tests.cjs` و`node tests/engine-tests.cjs` و`node tests/manager-tests.cjs` و`node tests/browser-tests.cjs` و`node tests/web-search-tests.cjs`.

1. فك ضغط الحزمة وافتح `eye_of_chaos/eye_of_chaos_site/index.html` لتجربة الواجهة الأساسية.
2. بعض خصائص PWA وService Worker وWeb Crypto تحتاج HTTPS أو `localhost`؛ فتح `file://` لا يوفر كامل إمكانات المتصفح.
3. على الاستضافة الآمنة، افتح الشاشة الرئيسية وانتظر تحميل الملفات مرة واحدة قبل تجربة العمل دون اتصال.
4. افتح الطرفية من رمزها في الشاشة الرئيسية. جرّب `أحسب 1+1` أو `احسب (12+3)*4` لمشاهدة النواة وهي توجه العملية إلى الحاسبة، و`نزّل برنامج Void Notes` لفتح المتجر ببحث جاهز. ومن واجهة CHAOS داخل التطبيقات جرّب `note` و`task` و`event` وتحقق من البيانات في التطبيقات المقابلة.

## حدود معروفة

- لم تُبنَ حزمة APK في هذا الإصدار، ولم تُختبر الواجهة تفاعليًا على جهاز أندرويد فعلي ضمن عملية البناء.
- لا يوجد خادم أو مزامنة سحابية أو إشعارات خلفية مضمونة.
- إعدادات Wi-Fi وBluetooth في واجهة الهاتف محاكاة بصرية ولا تتحكم فعليًا في الجهاز.
- مدير الملفات يقتصر على الملفات التي يختارها المستخدم وصلاحيات المتصفح.
- بيانات حساب Void Store تجريبية ومحلية؛ تُخزّن كلمات المرور الجديدة كبصمات PBKDF2، لكن ذلك لا يجعل الحساب محميًا بخادم أو مناسبًا للمعلومات الحساسة.

## الجديد في 1.6.0

- إضافة طبقة CHAOS SYSTEM مشتركة إلى الشاشة الرئيسية وكل الصفحات والتطبيقات المدمجة.
- إضافة أوامر لإنشاء الملاحظات والمهام والأحداث، والحساب المحدود، والذاكرة المشتركة وسجل النشاط.
- ربط طلبات فتح التطبيقات من داخل الطبقة بمشغّل VoidOS.
- حذف ملفات README المكررة من مجلدَي VoidTube وVoid Store وضم توثيق التطبيقات في هذا الملف المركزي.
- في الإصدار 1.6.0 كان التخزين المؤقت `eye-of-chaos-shell-v1-6-0`؛ الإصدار الحالي يستخدم `eye-of-chaos-shell-v2-0-0`.


## v1.7.0 — CHAOS Kernel & Security Modules
- The shared CHAOS command layer routes calculation requests to Void Calculator and app/download discovery requests to Void Store.
- The floating shared CHAOS panel is removed from the home screen; the terminal remains accessible from its dock icon.
- Security has been split into `js/brain/security/` modules: policy, input normalization/URL validation, bounded local audit storage, and a facade.
- These are browser-side safeguards only; they do not replace server-side authorization, a sandbox, or Android permissions.
- Calculator expressions are parsed without `eval`/`Function`; store entries without a real package remain marked unavailable rather than pretending to download.

- The integrated Void Store demo now hashes new passwords with PBKDF2-SHA-256 and migrates legacy plaintext demo credentials on successful login. This remains client-side demo authentication, not production identity management.


## v1.8.0 — Kernel-first architecture

- Added `js/kernel/` as the primary VoidOS orchestration layer: `kernel.js`, `intentEngine.js`, `serviceRegistry.js`, `taskRouter.js`, `eventBus.js`, `resultBus.js`, and `diagnostics.js`.
- Fixed Arabic calculation intent recognition, including `أحسب 1+1`, `احسب ١+١`, and verbal forms such as `واحد زائد واحد`. Calculator requests are validated and passed to Void Calculator.
- Store requests such as `نزّل برنامج Void Notes` open Void Store with a one-shot search request. Store entries without a real download remain unavailable.
- Moved the full terminal UI to `terminal/index.html`; `terminal.html` remains a compatibility redirect. The home launcher opens the new terminal layer.
- Registered application services and added kernel diagnostics, event/result buses, and regression tests for intent classification.
- The router is deterministic local rules, not a generative AI model. Browser storage, cross-origin/file URL limits, and lack of backend remain unchanged.


## v1.9.0 — مدير التطبيقات والصلاحيات وVoidBrowserX

- إضافة VoidBrowserX v1.2 إلى مشغّل VoidOS مع البحث والتنقل والرجوع والتقدّم والتحديث والرئيسية والاختصارات وسجل محلي محدود.
- يرفض المتصفح مخططات `javascript:` و`data:` و`file:`، ويقبل روابط HTTP/HTTPS فقط. يطلب منح صلاحية الشبكة من مدير الصلاحيات.
- إضافة مدير تطبيقات مركزي يعرض التطبيقات المسجلة ومساراتها وحالاتها، ويسمح بتعطيل التطبيقات الإضافية دون تعطيل التطبيقات الأساسية.
- إضافة مدير سياسة صلاحيات محلي للاتصال بالشبكة والتخزين المحلي والإشعارات. هذه سياسة داخل تطبيق الويب وليست بديلًا عن عزل Android أو صلاحيات نظام تشغيل أصلي.
- إضافة تشخيص لوحدات النواة وسجل الخدمات، وربط أوامر CHAOS مثل `افتح المتصفح` و`افتح مدير التطبيقات`.
- مواقع كثيرة تمنع العرض داخل `iframe` عبر CSP أو `X-Frame-Options`؛ في هذه الحالة استخدم زر الفتح الخارجي. لا يتجاوز VoidBrowserX سياسات المواقع.
- الاختبارات الجديدة: `tests/manager-tests.cjs` و`tests/browser-tests.cjs`، واختبارات توجيه النوايا تشمل المتصفح ومدير التطبيقات.
