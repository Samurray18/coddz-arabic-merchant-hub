import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/use-language";
import { HERO_ILLUSTRATION_URL, BRAND_NAME } from "@/lib/coddz";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "توصيل بلس — منصة COD للتجار" },
      { name: "description", content: "توصيل الطلبات والدفع عند الاستلام للتجار في الجزائر" },
    ],
  }),
});

function Index() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-body">
      {/* Top Site Navigation */}
      <header className="sticky top-0 z-30 bg-surface border-b border-outline-variant">
        <div className="max-w-6xl mx-auto px-gutter-xl py-4 flex items-center justify-between gap-gutter-lg">
          <div className="flex items-center gap-gutter-sm">
            <div className="w-10 h-10 rounded-md bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">local_shipping</span>
            </div>
            <span className="font-headline text-title-lg text-on-surface">توصيل بلس</span>
          </div>

          <nav aria-label="روابط الموقع" className="flex items-center gap-gutter-xl">
            <a href="#features" className="font-body text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
              المميزات
            </a>
            <a href="#pricing" className="font-body text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
              الأسعار
            </a>
            <Link to="/orders" className="font-body text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150">
              جدول الطلبات
            </Link>
          </nav>

          <div className="flex items-center gap-gutter-md">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as "ar" | "fr" | "en")}
              className="rounded-md border border-outline-variant bg-surface px-2 py-1 text-sm"
            >
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
            <Link to="/auth" className="font-headline text-label-lg text-primary px-3 py-2 rounded-md hover:bg-surface-container-low transition-colors">
              دخول التاجر
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-md bg-primary text-on-primary px-5 py-2.5 font-headline text-label-lg transition-colors hover:bg-success"
            >
              ابدأ مجانًا
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-gutter-xl py-12 flex flex-col gap-14">
        {/* Hero */}
        <section className="grid grid-cols-12 gap-gutter-xl items-center">
          <div className="col-span-6 flex flex-col gap-gutter-lg">
            <h1 className="font-display text-display-lg text-on-surface text-balance">
              أدر متجرك وطلبات الدفع عند الاستلام من مكان واحد
            </h1>
            <p className="font-body text-body-lg text-on-surface-variant text-pretty">
              من إنشاء صفحة المنتج إلى تأكيد الطلبات، الربط مع شركات التوصيل في 58 ولاية، تتبع المرتجعات وحساب أرباحك الصافية بالدينار الجزائري.
            </p>
            <div className="flex items-center gap-gutter-md">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center rounded-md bg-primary text-on-primary px-5 py-3 font-headline text-label-lg transition-colors hover:bg-success"
              >
                ابدأ التجربة المجانية
              </Link>
              <Link to="/dashboard" className="font-headline text-label-lg text-primary px-3 py-2 rounded-md hover:bg-surface-container-low transition-colors">
                جرّب لوحة التحكم
              </Link>
            </div>
          </div>
          <div className="col-span-6">
            <div className="rounded-xl overflow-hidden border border-outline-variant shadow-sm">
              <img
                src={HERO_ILLUSTRATION_URL}
                alt="توصيل الطلبات والدفع عند الاستلام للتجار في الجزائر"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </section>

        {/* Trust Metrics */}
        <section className="grid grid-cols-3 gap-gutter-lg">
          <div className="rounded-lg bg-surface-container-lowest border border-outline-variant p-6 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-headline text-headline-lg text-primary tabular-nums">58</span>
              <span className="font-body text-body-md text-on-surface-variant">ولاية مغطاة بالكامل</span>
            </div>
            <span className="w-12 h-12 rounded-md bg-accent-container text-on-accent-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">map</span>
            </span>
          </div>
          <div className="rounded-lg bg-surface-container-lowest border border-outline-variant p-6 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-headline text-headline-lg text-primary tabular-nums">94%</span>
              <span className="font-body text-body-md text-on-surface-variant">نسبة تأكيد الطلبات</span>
            </div>
            <span className="w-12 h-12 rounded-md bg-primary-container text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </span>
          </div>
          <div className="rounded-lg bg-surface-container-lowest border border-outline-variant p-6 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-headline text-headline-lg text-primary tabular-nums">24h</span>
              <span className="font-body text-body-md text-on-surface-variant">تحويل أرباح التاجر</span>
            </div>
            <span className="w-12 h-12 rounded-md bg-success-container text-on-success-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </span>
          </div>
        </section>

        {/* Features + Pricing */}
        <section id="features" className="grid grid-cols-12 gap-gutter-xl items-stretch">
          <div className="col-span-7 flex flex-col gap-gutter-lg">
            <h2 className="font-headline text-headline-lg text-on-surface">كل ما يحتاجه التاجر الجزائري</h2>
            <div className="grid grid-cols-2 gap-gutter-lg flex-1">
              <article className="h-full rounded-lg bg-surface-container-lowest border border-outline-variant p-5 shadow-sm flex flex-col gap-3">
                <header className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-headline text-title-lg text-on-surface">صفحة دفع سريعة</h3>
                    <p className="font-body text-label-md text-on-surface-variant">مخصصة للهاتف بدون تعقيد</p>
                  </div>
                  <span className="w-10 h-10 rounded-md bg-accent-container text-on-accent-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                  </span>
                </header>
                <p className="font-body text-body-md text-on-surface-variant text-pretty">
                  يطلب الزبون برقم هاتفه وولايته فقط مع حساب تلقائي لسعر التوصيل للمنزل أو المكتب.
                </p>
              </article>

              <article className="h-full rounded-lg bg-surface-container-lowest border border-outline-variant p-5 shadow-sm flex flex-col gap-3">
                <header className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-headline text-title-lg text-on-surface">ربط شركات التوصيل</h3>
                    <p className="font-body text-label-md text-on-surface-variant">تتبع لحظي لكل طرد</p>
                  </div>
                  <span className="w-10 h-10 rounded-md bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">sync_alt</span>
                  </span>
                </header>
                <p className="font-body text-body-md text-on-surface-variant text-pretty">
                  أرسل الطلبات المؤكدة بنقرة واحدة إلى ياليدين، زيد إكسبرس، أو نورد ويست وتابع المرتجعات.
                </p>
              </article>
            </div>
          </div>

          <div id="pricing" className="col-span-5 flex flex-col justify-end">
            <article className="rounded-xl bg-primary text-on-primary p-7 flex flex-col justify-between gap-6 h-full">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-accent text-on-accent px-3.5 py-1 font-body text-label-md">الباقة الاحترافية</span>
                <span className="font-headline text-headline-md tabular-nums">2,900 دج / شهر</span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-headline text-headline-md">طلبات غير محدودة وبدون عمولة على المبيعات</h3>
                <p className="font-body text-body-md text-primary-container">
                  ابدأ بتجربة مجانية لـ 30 طلبًا أولًا بدون بطاقة بنكية.
                </p>
              </div>
              <Link
                to="/auth"
                className="w-full inline-flex items-center justify-center rounded-md bg-accent text-on-accent py-3.5 px-5 font-headline text-label-lg"
              >
                ابدأ التجربة المجانية الآن
              </Link>
            </article>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-outline-variant bg-surface-container-low">
        <div className="max-w-6xl mx-auto px-gutter-xl py-6 flex items-center justify-between">
          <div className="flex items-center gap-gutter-sm">
            <span className="font-headline text-title-md text-on-surface">توصيل بلس</span>
            <span className="text-on-surface-variant">•</span>
            <span className="font-body text-body-md text-on-surface-variant">الجزائر العاصمة</span>
          </div>
          <p className="font-body text-label-sm text-on-surface-variant">جميع الحقوق محفوظة © 2026 منصة توصيل بلس</p>
        </div>
      </footer>
    </div>
  );
}