import { Link } from "@tanstack/react-router";

export function LandingPage(){
  return (
    <>
      <div className="lg:hidden">
<div className="min-h-[884px] flex flex-col max-w-md mx-auto bg-surface" data-stitch-vh="min-h-[884px]===min-h-screen">

    
    <header className="sticky top-0 z-30 bg-surface border-b border-outline-variant px-page-margin py-3 flex items-center justify-between gap-gutter-md">
      <div className="flex items-center gap-gutter-sm">
        <div className="w-9 h-9 rounded-md bg-primary text-on-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">local_shipping</span>
        </div>
        <span className="font-headline text-title-lg text-on-surface" data-design-text-token="title-lg">توصيل بلس</span>
      </div>
      <div className="flex items-center gap-gutter-sm">
        <a href="/dashboard" className="font-headline text-label-lg text-primary px-2 py-1.5 rounded-md hover:bg-surface-container-low transition-colors duration-state-change" data-design-text-token="label-lg">دخول التاجر</a>
        
        <a href="/orders" data-component-id="button-primary" data-component-type="button" data-component-variant="primary" className="inline-flex items-center justify-center rounded-md bg-primary text-on-primary px-4 py-2 font-headline text-label-md transition-colors duration-state-change ease-state-change hover:bg-success">
          <span data-design-text-token="label-md">ابدأ مجانًا</span>
        </a>
      </div>
    </header>

    
    <main className="flex-1 flex flex-col gap-section px-page-margin py-6">

      
      <section className="flex flex-col gap-gutter-lg">
        <div className="inline-flex self-start items-center gap-gutter-xs rounded-full bg-accent-container text-on-accent-container px-3 py-1">
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">verified</span>
          <span className="font-body text-label-md" data-design-text-token="label-md">منصة الدفع عند الاستلام في 58 ولاية</span>
        </div>

        <h1 className="font-display text-display-lg-mobile text-on-surface text-balance" data-design-text-token="display-lg-mobile">
          ضاعف مبيعات متجرك مع الدفع عند الاستلام بكل سلاسة
        </h1>

        <p className="font-body text-body-lg text-on-surface-variant text-pretty" data-design-text-token="body-lg">
          استقبل طلبات زبائنك عبر صفحة دفع سريعة، أكدها هاتفيًا، وتابع شحناتك وتحصيل أموالك بالدينار الجزائري من هاتفك.
        </p>

        <div className="flex flex-col gap-gutter-md">
          
          <a href="/dashboard" data-component-id="button-with-icon" data-component-type="button" data-component-variant="with-icon" className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary text-on-primary px-5 py-3.5 font-headline text-label-lg transition-colors duration-state-change ease-state-change hover:bg-success">
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">rocket_launch</span>
            <span data-design-text-token="label-lg">أنشئ متجرك خلال دقيقتين</span>
          </a>

          
          <a href="/orders" data-component-id="button-secondary" data-component-type="button" data-component-variant="secondary" className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-surface-container-lowest text-primary border border-outline-variant px-5 py-3 font-headline text-label-lg transition-colors duration-state-change ease-state-change hover:bg-surface-container-low">
            <span data-design-text-token="label-lg">جرّب نموذج الدفع عند الاستلام</span>
          </a>
        </div>

        <div className="rounded-xl overflow-hidden border border-outline-variant bg-surface-container-lowest">
          <img src="/images/hero-box-phone.png" alt="توصيل الطلبات والدفع عند الاستلام للتجار في الجزائر" className="w-full h-52 object-cover" />
        </div>
      </section>

      
      <section className="grid grid-cols-3 gap-gutter-md">
        <div className="rounded-lg bg-surface-container-lowest border border-outline-variant p-3 flex flex-col gap-1 text-center">
          <span className="font-headline text-headline-md text-primary tabular-nums" data-design-text-token="headline-md">58</span>
          <span className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">ولاية مغطاة</span>
        </div>
        <div className="rounded-lg bg-surface-container-lowest border border-outline-variant p-3 flex flex-col gap-1 text-center">
          <span className="font-headline text-headline-md text-primary tabular-nums" data-design-text-token="headline-md">94%</span>
          <span className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">نسبة التأكيد</span>
        </div>
        <div className="rounded-lg bg-surface-container-lowest border border-outline-variant p-3 flex flex-col gap-1 text-center">
          <span className="font-headline text-headline-md text-primary tabular-nums" data-design-text-token="headline-md">24h</span>
          <span className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">تحويل الأرباح</span>
        </div>
      </section>

      
      <section className="flex flex-col gap-gutter-md">
        <h2 className="font-headline text-headline-lg-mobile text-on-surface" data-design-text-token="headline-lg-mobile">
          كل ما يحتاجه التاجر الجزائري
        </h2>

        
        <article data-component-id="card-elevated" data-component-type="card" data-component-variant="elevated" className="w-full rounded-lg bg-surface-container-lowest border border-outline-variant p-4 shadow-sm flex flex-col gap-3">
          <header className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-headline text-title-lg text-on-surface" data-design-text-token="title-lg">صفحة دفع سريعة بصفحة واحدة</h3>
              <p className="font-body text-label-md text-on-surface-variant" data-design-text-token="label-md">مخصصة للهاتف بدون تعقيد</p>
            </div>
            <span className="w-10 h-10 rounded-md bg-accent-container text-on-accent-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            </span>
          </header>
          <div>
            <p className="font-body text-body-md text-on-surface-variant text-pretty" data-design-text-token="body-md">
              يطلب الزبون برقم هاتفه وولايته فقط مع حساب تلقائي لسعر التوصيل للمنزل أو المكتب.
            </p>
          </div>
        </article>

        
        <article data-component-id="card-elevated" data-component-type="card" data-component-variant="elevated" className="w-full rounded-lg bg-surface-container-lowest border border-outline-variant p-4 shadow-sm flex flex-col gap-3">
          <header className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-headline text-title-lg text-on-surface" data-design-text-token="title-lg">ربط مباشر مع شركات التوصيل</h3>
              <p className="font-body text-label-md text-on-surface-variant" data-design-text-token="label-md">تتبع لحظي لكل طرد</p>
            </div>
            <span className="w-10 h-10 rounded-md bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">sync_alt</span>
            </span>
          </header>
          <div>
            <p className="font-body text-body-md text-on-surface-variant text-pretty" data-design-text-token="body-md">
              أرسل الطلبات المؤكدة بنقرة واحدة إلى ياليدين، زيد إكسبرس، أو نورد ويست وتابع المرتجعات.
            </p>
          </div>
        </article>

        
        <article className="rounded-xl bg-primary text-on-primary p-5 flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-accent text-on-accent px-3 py-1 font-body text-label-sm" data-design-text-token="label-sm">الباقة الاحترافية</span>
            <span className="font-headline text-headline-md tabular-nums" data-design-text-token="headline-md">2,900 دج / شهر</span>
          </div>
          <h3 className="font-headline text-title-lg" data-design-text-token="title-lg">طلبات غير محدودة وبدون عمولة على المبيعات</h3>
          <p className="font-body text-body-md text-primary-container" data-design-text-token="body-md">
            ابدأ بتجربة مجانية لـ 30 طلبًا أولًا بدون بطاقة بنكية.
          </p>
          <a href="/dashboard" className="w-full inline-flex items-center justify-center rounded-md bg-accent text-on-accent py-3 px-4 font-headline text-label-lg">
            <span data-design-text-token="label-lg">ابدأ التجربة المجانية الآن</span>
          </a>
        </article>
      </section>

    </main>

    
    <footer className="border-t border-outline-variant bg-surface-container-low px-page-margin py-6 flex flex-col gap-gutter-sm text-center">
      <div className="flex items-center justify-center gap-gutter-sm">
        <span className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">توصيل بلس</span>
        <span className="text-on-surface-variant">•</span>
        <span className="font-body text-body-md text-on-surface-variant" data-design-text-token="body-md">الجزائر العاصمة</span>
      </div>
      <p className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">جميع الحقوق محفوظة © 2026 منصة توصيل بلس</p>
    </footer>

  </div>
</div>
      <div className="hidden lg:block">
<div className="min-h-[1024px] flex flex-col bg-surface" data-stitch-vh="min-h-[1024px]===min-h-screen">

    
    <header className="sticky top-0 z-30 bg-surface border-b border-outline-variant">
      <div className="max-w-6xl mx-auto px-gutter-xl py-4 flex items-center justify-between gap-gutter-lg">
        <div className="flex items-center gap-gutter-sm">
          <div className="w-10 h-10 rounded-md bg-primary text-on-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">local_shipping</span>
          </div>
          <span className="font-headline text-title-lg text-on-surface" data-design-text-token="title-lg">توصيل بلس</span>
        </div>

        <nav aria-label="روابط الموقع" className="flex items-center gap-gutter-xl">
          <a href="#features" className="font-body text-body-md text-on-surface-variant hover:text-primary transition-colors duration-state-change" data-design-text-token="body-md">المميزات</a>
          <a href="#pricing" className="font-body text-body-md text-on-surface-variant hover:text-primary transition-colors duration-state-change" data-design-text-token="body-md">الأسعار</a>
          <a href="/orders" className="font-body text-body-md text-on-surface-variant hover:text-primary transition-colors duration-state-change" data-design-text-token="body-md">جدول الطلبات</a>
        </nav>

        <div className="flex items-center gap-gutter-md">
          <a href="/dashboard" className="font-headline text-label-lg text-primary px-3 py-2 rounded-md hover:bg-surface-container-low transition-colors duration-state-change" data-design-text-token="label-lg">دخول التاجر</a>
          
          <a href="/orders" data-component-id="button-primary" data-component-type="button" data-component-variant="primary" className="inline-flex items-center justify-center rounded-md bg-primary text-on-primary px-5 py-2.5 font-headline text-label-lg transition-colors duration-state-change ease-state-change hover:bg-success">
            <span data-design-text-token="label-lg">ابدأ مجانًا</span>
          </a>
        </div>
      </div>
    </header>

    
    <main className="flex-1 max-w-6xl w-full mx-auto px-gutter-xl py-12 flex flex-col gap-14">

      
      <section className="grid grid-cols-12 gap-gutter-xl items-center">
        <div className="col-span-6 flex flex-col gap-gutter-lg">
          <div className="inline-flex self-start items-center gap-gutter-xs rounded-full bg-accent-container text-on-accent-container px-3.5 py-1.5">
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">verified</span>
            <span className="font-body text-label-md" data-design-text-token="label-md">منصة الدفع عند الاستلام في 58 ولاية</span>
          </div>

          <h1 className="font-display text-display-lg text-on-surface text-balance" data-design-text-token="display-lg">
            ضاعف مبيعات متجرك مع الدفع عند الاستلام بكل سلاسة
          </h1>

          <p className="font-body text-body-lg text-on-surface-variant text-pretty max-w-prose" data-design-text-token="body-lg">
            استقبل طلبات زبائنك عبر صفحة دفع سريعة، أكدها هاتفيًا، وتابع شحناتك وتحصيل أموالك بالدينار الجزائري من لوحة تحكم واحدة.
          </p>

          <div className="flex items-center gap-gutter-md pt-2">
            
            <a href="/dashboard" data-component-id="button-with-icon" data-component-type="button" data-component-variant="with-icon" className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-on-primary px-6 py-3.5 font-headline text-label-lg transition-colors duration-state-change ease-state-change hover:bg-success">
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">rocket_launch</span>
              <span data-design-text-token="label-lg">أنشئ متجرك خلال دقيقتين</span>
            </a>

            
            <a href="/orders" data-component-id="button-secondary" data-component-type="button" data-component-variant="secondary" className="inline-flex items-center justify-center gap-2 rounded-md bg-surface-container-lowest text-primary border border-outline-variant px-6 py-3.5 font-headline text-label-lg transition-colors duration-state-change ease-state-change hover:bg-surface-container-low">
              <span data-design-text-token="label-lg">جرّب نموذج الدفع</span>
            </a>
          </div>
        </div>

        <div className="col-span-6">
          <div className="rounded-xl overflow-hidden border border-outline-variant bg-surface-container-lowest shadow-sm">
            <img src="/images/hero-box-phone.png" alt="توصيل الطلبات والدفع عند الاستلام للتجار في الجزائر" className="w-full h-96 object-cover" />
          </div>
        </div>
      </section>

      
      <section className="grid grid-cols-3 gap-gutter-lg">
        <div className="rounded-lg bg-surface-container-lowest border border-outline-variant p-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-headline text-headline-lg text-primary tabular-nums" data-design-text-token="headline-lg">58</span>
            <span className="font-body text-body-md text-on-surface-variant" data-design-text-token="body-md">ولاية مغطاة بالكامل</span>
          </div>
          <span className="w-12 h-12 rounded-md bg-accent-container text-on-accent-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">map</span>
          </span>
        </div>
        <div className="rounded-lg bg-surface-container-lowest border border-outline-variant p-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-headline text-headline-lg text-primary tabular-nums" data-design-text-token="headline-lg">94%</span>
            <span className="font-body text-body-md text-on-surface-variant" data-design-text-token="body-md">نسبة تأكيد الطلبات</span>
          </div>
          <span className="w-12 h-12 rounded-md bg-primary-container text-on-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </span>
        </div>
        <div className="rounded-lg bg-surface-container-lowest border border-outline-variant p-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-headline text-headline-lg text-primary tabular-nums" data-design-text-token="headline-lg">24h</span>
            <span className="font-body text-body-md text-on-surface-variant" data-design-text-token="body-md">تحويل أرباح التاجر</span>
          </div>
          <span className="w-12 h-12 rounded-md bg-success-container text-on-success-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">payments</span>
          </span>
        </div>
      </section>

      
      <section id="features" className="grid grid-cols-12 gap-gutter-xl items-stretch">
        <div className="col-span-7 flex flex-col gap-gutter-lg">
          <h2 className="font-headline text-headline-lg text-on-surface" data-design-text-token="headline-lg">
            كل ما يحتاجه التاجر الجزائري
          </h2>

          <div className="grid grid-cols-2 gap-gutter-lg flex-1">
            
            <article data-component-id="card-elevated" data-component-type="card" data-component-variant="elevated" className="h-full rounded-lg bg-surface-container-lowest border border-outline-variant p-5 shadow-sm flex flex-col gap-3">
              <header className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-headline text-title-lg text-on-surface" data-design-text-token="title-lg">صفحة دفع سريعة</h3>
                  <p className="font-body text-label-md text-on-surface-variant" data-design-text-token="label-md">مخصصة للهاتف بدون تعقيد</p>
                </div>
                <span className="w-10 h-10 rounded-md bg-accent-container text-on-accent-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                </span>
              </header>
              <div>
                <p className="font-body text-body-md text-on-surface-variant text-pretty" data-design-text-token="body-md">
                  يطلب الزبون برقم هاتفه وولايته فقط مع حساب تلقائي لسعر التوصيل للمنزل أو المكتب.
                </p>
              </div>
            </article>

            
            <article data-component-id="card-elevated" data-component-type="card" data-component-variant="elevated" className="h-full rounded-lg bg-surface-container-lowest border border-outline-variant p-5 shadow-sm flex flex-col gap-3">
              <header className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-headline text-title-lg text-on-surface" data-design-text-token="title-lg">ربط شركات التوصيل</h3>
                  <p className="font-body text-label-md text-on-surface-variant" data-design-text-token="label-md">تتبع لحظي لكل طرد</p>
                </div>
                <span className="w-10 h-10 rounded-md bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">sync_alt</span>
                </span>
              </header>
              <div>
                <p className="font-body text-body-md text-on-surface-variant text-pretty" data-design-text-token="body-md">
                  أرسل الطلبات المؤكدة بنقرة واحدة إلى ياليدين، زيد إكسبرس، أو نورد ويست وتابع المرتجعات.
                </p>
              </div>
            </article>
          </div>
        </div>

        
        <div id="pricing" className="col-span-5 flex flex-col justify-end">
          <article className="rounded-xl bg-primary text-on-primary p-7 flex flex-col justify-between gap-gutter-lg h-full">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-accent text-on-accent px-3.5 py-1 font-body text-label-md" data-design-text-token="label-md">الباقة الاحترافية</span>
              <span className="font-headline text-headline-md tabular-nums" data-design-text-token="headline-md">2,900 دج / شهر</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-headline text-headline-md" data-design-text-token="headline-md">طلبات غير محدودة وبدون عمولة على المبيعات</h3>
              <p className="font-body text-body-md text-primary-container" data-design-text-token="body-md">
                ابدأ بتجربة مجانية لـ 30 طلبًا أولًا بدون بطاقة بنكية.
              </p>
            </div>
            <a href="/dashboard" className="w-full inline-flex items-center justify-center rounded-md bg-accent text-on-accent py-3.5 px-5 font-headline text-label-lg">
              <span data-design-text-token="label-lg">ابدأ التجربة المجانية الآن</span>
            </a>
          </article>
        </div>
      </section>

    </main>

    
    <footer className="border-t border-outline-variant bg-surface-container-low">
      <div className="max-w-6xl mx-auto px-gutter-xl py-6 flex items-center justify-between">
        <div className="flex items-center gap-gutter-sm">
          <span className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">توصيل بلس</span>
          <span className="text-on-surface-variant">•</span>
          <span className="font-body text-body-md text-on-surface-variant" data-design-text-token="body-md">الجزائر العاصمة</span>
        </div>
        <p className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">جميع الحقوق محفوظة © 2026 منصة توصيل بلس</p>
      </div>
    </footer>

  </div>
</div>
    </>
  );
}
