# شجرة العائلة

تطبيق ويب (PWA) لشجرة العائلة: عربي/إنجليزي، يعمل على الجوال ويُثبَّت كتطبيق، والبيانات محفوظة في **Supabase** مع تسجيل دخول بالدعوات وصلاحيات على مستوى الصفوف (RLS).

## البنية

| الملف | الدور |
|---|---|
| `index.html` | التطبيق كاملًا (الواجهة + المنطق) |
| `config.js` | رابط مشروع Supabase والمفتاح العام (publishable) |
| `supabase.js` | مكتبة supabase-js مضمّنة محليًا |
| `sw.js` | Service Worker لتخزين واجهة التطبيق فقط — بيانات العائلة لا تُخزَّن |
| `manifest.webmanifest`, `icon-*.png` | إعدادات التثبيت كتطبيق |
| `fonts/` | خط Tajawal محليًا |

## التشغيل محليًا

```bash
python3 -m http.server 8080
```

ثم افتح <http://localhost:8080>. (لا يعمل بفتح `index.html` مباشرة لأن الـ Service Worker يحتاج خادمًا.)

## النشر على GitHub Pages

Settings → Pages → Source: **Deploy from a branch** → `main` / `(root)`.
بعدها أضف رابط الموقع في Supabase: Authentication → URL Configuration → Site URL / Redirect URLs.

## عن المفتاح في `config.js`

المفتاح من نوع *publishable* ومصمم ليكون علنيًا؛ الحماية الفعلية تأتي من تسجيل الدخول وسياسات RLS في قاعدة البيانات. **إن عُطّلت RLS على أي جدول فالبيانات مكشوفة لأي أحد يملك هذا المفتاح.**

## الواجهة الخلفية (غير موجودة في هذا المستودع)

التطبيق يعتمد على دوال RPC في Supabase: `load_all`، `apply_changes`، `redeem_invitation`، `decide_suggestion`، `update_my_profile`، إضافة إلى الجداول وسياسات RLS. هذه **ليست** ضمن الملفات، فلا يمكن إعادة بناء المشروع من الصفر بدونها. لتصديرها:

```bash
supabase db dump --schema public -f supabase/schema.sql
```

ثم أضف `supabase/schema.sql` إلى المستودع (المخطط فقط، **بدون** بيانات الأشخاص).

## عند تحديث الملفات

ارفع رقم `CACHE` في `sw.js` (مثل `family-tree-shell-v7`) حتى يحصل المستخدمون على النسخة الجديدة.
