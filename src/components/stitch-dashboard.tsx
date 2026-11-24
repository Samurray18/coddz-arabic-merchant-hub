import { BRAND_NAME } from "@/lib/coddz";
import { Link } from "@tanstack/react-router";

export function StitchDashboard(){
  return (
    <>
      <div className="lg:hidden">
<div className="min-h-[884px] flex flex-col max-w-md mx-auto bg-surface" data-stitch-vh="min-h-[884px]===min-h-screen">

    
    <header className="sticky top-0 z-30 bg-surface border-b border-outline-variant px-page-margin py-3 flex items-center justify-between gap-gutter-md">
      <div className="flex items-center gap-gutter-sm">
        <div className="w-9 h-9 rounded-md bg-primary text-on-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">local_shipping</span>
        </div>
        <div className="flex flex-col">
          <span className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">متجر النخيل</span>
          <span className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">{BRAND_NAME} • 16 الجزائر</span>
        </div>
      </div>
      <div className="flex items-center gap-gutter-sm">
        
        <button data-component-id="button-icon" data-component-type="button" data-component-variant="icon" type="button" aria-label="الإشعارات" className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface border border-outline-variant transition-colors duration-state-change ease-state-change hover:bg-surface-container-low">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="w-2 h-2 rounded-full bg-accent absolute top-2 right-2"></span>
        </button>
      </div>
    </header>

    
    <main className="flex-1 flex flex-col gap-gutter-xl px-page-margin py-5 pb-24">

      
      <div className="flex items-center justify-between gap-gutter-md">
        <div>
          <h1 className="font-headline text-headline-lg-mobile text-on-surface" data-design-text-token="headline-lg-mobile">ملخص اليوم</h1>
          <p className="font-body text-body-md text-on-surface-variant" data-design-text-token="body-md">الإثنين 23 نوفمبر • أداء المتجر</p>
        </div>
        
        <a href="/checkout" data-component-id="button-with-icon" data-component-type="button" data-component-variant="with-icon" className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary text-on-primary px-3.5 py-2.5 font-headline text-label-md transition-colors duration-state-change ease-state-change hover:bg-success shrink-0">
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">add_circle</span>
          <span data-design-text-token="label-md">طلب جديد</span>
        </a>
      </div>

      
      <section className="grid grid-cols-2 gap-gutter-md items-stretch">
        
        <article data-component-id="card-elevated" data-component-type="card" data-component-variant="elevated" className="h-full rounded-lg bg-surface-container-lowest border border-outline-variant p-4 shadow-sm flex flex-col justify-between gap-3">
          <header className="flex items-center justify-between gap-2">
            <h2 className="font-body text-label-md text-on-surface-variant" data-design-text-token="label-md">المبيعات</h2>
            <span className="w-8 h-8 rounded-md bg-accent-container text-on-accent-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
          </header>
          <div className="flex flex-col gap-1">
            <p className="font-headline text-headline-md text-on-surface tabular-nums" data-design-text-token="headline-md">482,500 دج</p>
            <span className="font-body text-label-sm text-primary" data-design-text-token="label-sm">+14% هذا الأسبوع</span>
          </div>
        </article>

        
        <article data-component-id="card-elevated" data-component-type="card" data-component-variant="elevated" className="h-full rounded-lg bg-surface-container-lowest border border-outline-variant p-4 shadow-sm flex flex-col justify-between gap-3">
          <header className="flex items-center justify-between gap-2">
            <h2 className="font-body text-label-md text-on-surface-variant" data-design-text-token="label-md">قيد التأكيد</h2>
            <span className="w-8 h-8 rounded-md bg-warning-container text-on-warning-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">call</span>
            </span>
          </header>
          <div className="flex flex-col gap-1">
            <p className="font-headline text-headline-md text-on-surface tabular-nums" data-design-text-token="headline-md">19 طلبًا</p>
            <span className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">بانتظار الاتصال</span>
          </div>
        </article>

        
        <article data-component-id="card-elevated" data-component-type="card" data-component-variant="elevated" className="h-full rounded-lg bg-surface-container-lowest border border-outline-variant p-4 shadow-sm flex flex-col justify-between gap-3">
          <header className="flex items-center justify-between gap-2">
            <h2 className="font-body text-label-md text-on-surface-variant" data-design-text-token="label-md">قيد التوصيل</h2>
            <span className="w-8 h-8 rounded-md bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            </span>
          </header>
          <div className="flex flex-col gap-1">
            <p className="font-headline text-headline-md text-on-surface tabular-nums" data-design-text-token="headline-md">47 طردًا</p>
            <span className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">في 22 ولاية</span>
          </div>
        </article>

        
        <article data-component-id="card-elevated" data-component-type="card" data-component-variant="elevated" className="h-full rounded-lg bg-surface-container-lowest border border-outline-variant p-4 shadow-sm flex flex-col justify-between gap-3">
          <header className="flex items-center justify-between gap-2">
            <h2 className="font-body text-label-md text-on-surface-variant" data-design-text-token="label-md">نسبة التسليم</h2>
            <span className="w-8 h-8 rounded-md bg-success-container text-on-success-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
            </span>
          </header>
          <div className="flex flex-col gap-1">
            <p className="font-headline text-headline-md text-on-surface tabular-nums" data-design-text-token="headline-md">88.4%</p>
            <span className="font-body text-label-sm text-primary" data-design-text-token="label-sm">مرتجع 11.6%</span>
          </div>
        </article>
      </section>

      
      <section className="rounded-lg bg-surface-container-lowest border border-outline-variant p-4 shadow-sm flex flex-col gap-gutter-md">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">رصيد التحصيل القادم</h2>
            <p className="font-body text-label-md text-on-surface-variant text-balance" data-design-text-token="label-md">التحويل يوم الخميس عبر CCP</p>
          </div>
          <span className="font-headline text-title-lg text-primary tabular-nums shrink-0" data-design-text-token="title-lg">126,400 دج</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-surface-container-low overflow-hidden">
          <div className="h-full w-3/4 rounded-full bg-accent"></div>
        </div>
        <div className="flex items-center justify-between font-body text-label-sm text-on-surface-variant">
          <span data-design-text-token="label-sm">تم تسليم 31 طلبًا</span>
          <span className="tabular-nums" data-design-text-token="label-sm">75% مؤكد للتحويل</span>
        </div>
      </section>

      
      <section className="flex flex-col gap-gutter-md">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-title-lg text-on-surface" data-design-text-token="title-lg">طلبات بانتظار التأكيد</h2>
          <a href="/orders" className="font-headline text-label-md text-primary" data-design-text-token="label-md">عرض الكل</a>
        </div>

        
        <article data-component-id="card-action" data-component-type="card" data-component-variant="action" className="w-full rounded-lg bg-surface-container-lowest border border-outline-variant p-4 shadow-sm flex flex-col gap-3">
          <header className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-mono-md text-on-surface" data-design-text-token="mono-md">#DZ-8492</span>
              <span className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">منذ 12 دقيقة</span>
            </div>
            <span className="rounded-full bg-warning-container text-on-warning-container px-2.5 py-0.5 font-body text-label-sm" data-design-text-token="label-sm">قيد التأكيد</span>
          </header>
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">أمين بن علي</h3>
              <p className="font-body text-body-md text-on-surface-variant" data-design-text-token="body-md">16 - الجزائر (باب الزوار) • ساعة ذكية</p>
            </div>
            <span className="font-headline text-title-md text-primary tabular-nums shrink-0" data-design-text-token="title-md">5,100 دج</span>
          </div>
          <footer className="flex items-center gap-2 pt-2 border-t border-outline-variant">
            <button type="button" className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-primary text-on-primary py-2 px-3 font-headline text-label-md hover:bg-success transition-colors duration-state-change">
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">check_circle</span>
              <span data-design-text-token="label-md">تأكيد وإرسال</span>
            </button>
            <button type="button" className="inline-flex items-center justify-center gap-1 rounded-md bg-surface-container-low text-on-surface py-2 px-3 font-headline text-label-md hover:bg-surface-container transition-colors duration-state-change">
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">call</span>
              <span data-design-text-token="label-md">اتصال</span>
            </button>
          </footer>
        </article>

        
        <article data-component-id="card-action" data-component-type="card" data-component-variant="action" className="w-full rounded-lg bg-surface-container-lowest border border-outline-variant p-4 shadow-sm flex flex-col gap-3">
          <header className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-mono-md text-on-surface" data-design-text-token="mono-md">#DZ-8491</span>
              <span className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">منذ 35 دقيقة</span>
            </div>
            <span className="rounded-full bg-warning-container text-on-warning-container px-2.5 py-0.5 font-body text-label-sm" data-design-text-token="label-sm">محاولة ثانية</span>
          </header>
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">خديجة مرابط</h3>
              <p className="font-body text-body-md text-on-surface-variant" data-design-text-token="body-md">31 - وهران (السانية) • سماعات لاسلكية</p>
            </div>
            <span className="font-headline text-title-md text-primary tabular-nums shrink-0" data-design-text-token="title-md">3,850 دج</span>
          </div>
          <footer className="flex items-center gap-2 pt-2 border-t border-outline-variant">
            <button type="button" className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-primary text-on-primary py-2 px-3 font-headline text-label-md hover:bg-success transition-colors duration-state-change">
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">check_circle</span>
              <span data-design-text-token="label-md">تأكيد وإرسال</span>
            </button>
            <button type="button" className="inline-flex items-center justify-center gap-1 rounded-md bg-surface-container-low text-on-surface py-2 px-3 font-headline text-label-md hover:bg-surface-container transition-colors duration-state-change">
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">call</span>
              <span data-design-text-token="label-md">اتصال</span>
            </button>
          </footer>
        </article>
      </section>

    </main>

    
    <nav aria-label="التنقل الرئيسي" className="fixed bottom-0 inset-x-0 z-30 max-w-md mx-auto bg-surface-container-lowest border-t border-outline-variant px-2 py-2 grid grid-cols-4 gap-1">
      <a href="/dashboard" aria-current="page" className="flex flex-col items-center justify-center gap-1 py-1.5 rounded-md bg-accent-container text-on-accent-container">
        <span className="material-symbols-outlined text-[22px]" style={{fontVariationSettings: "'FILL' 1"}}>dashboard</span>
        <span className="font-headline text-label-sm" data-design-text-token="label-sm">الرئيسية</span>
      </a>
      <a href="/orders" className="flex flex-col items-center justify-center gap-1 py-1.5 rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors duration-state-change">
        <span className="material-symbols-outlined text-[22px]">receipt_long</span>
        <span className="font-body text-label-sm" data-design-text-token="label-sm">الطلبات</span>
      </a>
      <a href="/checkout" className="flex flex-col items-center justify-center gap-1 py-1.5 rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors duration-state-change">
        <span className="material-symbols-outlined text-[22px]">shopping_cart_checkout</span>
        <span className="font-body text-label-sm" data-design-text-token="label-sm">نموذج الدفع</span>
      </a>
      <a href="../landing-page/LandingPage.html" className="flex flex-col items-center justify-center gap-1 py-1.5 rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors duration-state-change">
        <span className="material-symbols-outlined text-[22px]">storefront</span>
        <span className="font-body text-label-sm" data-design-text-token="label-sm">المتجر</span>
      </a>
    </nav>

  </div>
</div>
      <div className="hidden lg:block">
<div className="min-h-[1024px] w-full max-w-[1280px] mx-auto grid grid-cols-[240px_1fr] bg-surface overflow-x-hidden" data-stitch-vh="min-h-[1024px]===min-h-screen">

    
    <aside className="min-h-[1024px] bg-surface-container-lowest border-l border-outline-variant p-5 flex flex-col justify-between" data-stitch-vh="min-h-[1024px]===min-h-screen">
      <div className="flex flex-col gap-gutter-xl">
        <div className="flex items-center gap-gutter-sm px-2">
          <div className="w-10 h-10 rounded-md bg-primary text-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">local_shipping</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">متجر النخيل</span>
            <span className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">{BRAND_NAME} • 16 الجزائر</span>
          </div>
        </div>

        <nav aria-label="التنقل الرئيسي" className="flex flex-col gap-gutter-xs">
          <a href="/dashboard" aria-current="page" className="flex items-center gap-gutter-md px-3.5 py-2.5 rounded-md bg-accent-container text-on-accent-container">
            <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>dashboard</span>
            <span className="font-headline text-label-lg" data-design-text-token="label-lg">الرئيسية</span>
          </a>
          <a href="/orders" className="flex items-center gap-gutter-md px-3.5 py-2.5 rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors duration-state-change">
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            <span className="font-body text-body-md" data-design-text-token="body-md">الطلبات</span>
          </a>
          <a href="/checkout" className="flex items-center gap-gutter-md px-3.5 py-2.5 rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors duration-state-change">
            <span className="material-symbols-outlined text-[20px]">shopping_cart_checkout</span>
            <span className="font-body text-body-md" data-design-text-token="body-md">نموذج الدفع</span>
          </a>
          <a href="../landing-page-desktop/LandingPageDesktop.html" className="flex items-center gap-gutter-md px-3.5 py-2.5 rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors duration-state-change">
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            <span className="font-body text-body-md" data-design-text-token="body-md">المتجر</span>
          </a>
        </nav>
      </div>

      <div className="rounded-lg bg-surface-container-low border border-outline-variant p-3 flex items-center gap-gutter-sm">
        <span className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline text-label-md shrink-0" data-design-text-token="label-md">ن</span>
        <div className="flex flex-col min-w-0">
          <span className="font-headline text-label-md text-on-surface" data-design-text-token="label-md">يوسف الجزائري</span>
          <span className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">حساب تاجر موثق</span>
        </div>
      </div>
    </aside>

    
    <div className="flex flex-col min-w-0">
      
      <header className="sticky top-0 z-30 bg-surface border-b border-outline-variant px-6 py-4 flex items-center justify-between gap-gutter-md">
        <div>
          <h1 className="font-headline text-headline-lg text-on-surface" data-design-text-token="headline-lg">ملخص اليوم</h1>
          <p className="font-body text-body-md text-on-surface-variant" data-design-text-token="body-md">الإثنين 23 نوفمبر • أداء المتجر</p>
        </div>
        <div className="flex items-center gap-gutter-md">
          
          <button data-component-id="button-icon" data-component-type="button" data-component-variant="icon" type="button" aria-label="الإشعارات" className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface border border-outline-variant transition-colors duration-state-change ease-state-change hover:bg-surface-container-low">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="w-2 h-2 rounded-full bg-accent absolute top-2 right-2"></span>
          </button>
        </div>
      </header>

      
      <main className="flex-1 w-full px-6 py-6 flex flex-col gap-gutter-xl">

        
        <div className="flex items-center justify-end">
          
          <a href="/checkout" data-component-id="button-with-icon" data-component-type="button" data-component-variant="with-icon" className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-on-primary px-5 py-2.5 font-headline text-label-lg transition-colors duration-state-change ease-state-change hover:bg-success">
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">add_circle</span>
            <span data-design-text-token="label-lg">طلب جديد</span>
          </a>
        </div>

        
        <section className="grid grid-cols-4 gap-gutter-lg items-stretch">
          
          <article data-component-id="card-elevated" data-component-type="card" data-component-variant="elevated" className="h-full rounded-lg bg-surface-container-lowest border border-outline-variant p-5 shadow-sm flex flex-col justify-between gap-3">
            <header className="flex items-center justify-between gap-2">
              <h2 className="font-body text-label-md text-on-surface-variant" data-design-text-token="label-md">المبيعات</h2>
              <span className="w-9 h-9 rounded-md bg-accent-container text-on-accent-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </span>
            </header>
            <div className="flex flex-col gap-1">
              <p className="font-headline text-headline-md text-on-surface tabular-nums" data-design-text-token="headline-md">482,500 دج</p>
              <span className="font-body text-label-sm text-primary" data-design-text-token="label-sm">+14% هذا الأسبوع</span>
            </div>
          </article>

          
          <article data-component-id="card-elevated" data-component-type="card" data-component-variant="elevated" className="h-full rounded-lg bg-surface-container-lowest border border-outline-variant p-5 shadow-sm flex flex-col justify-between gap-3">
            <header className="flex items-center justify-between gap-2">
              <h2 className="font-body text-label-md text-on-surface-variant" data-design-text-token="label-md">قيد التأكيد</h2>
              <span className="w-9 h-9 rounded-md bg-warning-container text-on-warning-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">call</span>
              </span>
            </header>
            <div className="flex flex-col gap-1">
              <p className="font-headline text-headline-md text-on-surface tabular-nums" data-design-text-token="headline-md">19 طلبًا</p>
              <span className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">بانتظار الاتصال</span>
            </div>
          </article>

          
          <article data-component-id="card-elevated" data-component-type="card" data-component-variant="elevated" className="h-full rounded-lg bg-surface-container-lowest border border-outline-variant p-5 shadow-sm flex flex-col justify-between gap-3">
            <header className="flex items-center justify-between gap-2">
              <h2 className="font-body text-label-md text-on-surface-variant" data-design-text-token="label-md">قيد التوصيل</h2>
              <span className="w-9 h-9 rounded-md bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              </span>
            </header>
            <div className="flex flex-col gap-1">
              <p className="font-headline text-headline-md text-on-surface tabular-nums" data-design-text-token="headline-md">47 طردًا</p>
              <span className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">في 22 ولاية</span>
            </div>
          </article>

          
          <article data-component-id="card-elevated" data-component-type="card" data-component-variant="elevated" className="h-full rounded-lg bg-surface-container-lowest border border-outline-variant p-5 shadow-sm flex flex-col justify-between gap-3">
            <header className="flex items-center justify-between gap-2">
              <h2 className="font-body text-label-md text-on-surface-variant" data-design-text-token="label-md">نسبة التسليم</h2>
              <span className="w-9 h-9 rounded-md bg-success-container text-on-success-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">task_alt</span>
              </span>
            </header>
            <div className="flex flex-col gap-1">
              <p className="font-headline text-headline-md text-on-surface tabular-nums" data-design-text-token="headline-md">88.4%</p>
              <span className="font-body text-label-sm text-primary" data-design-text-token="label-sm">مرتجع 11.6%</span>
            </div>
          </article>
        </section>

        
        <section className="grid grid-cols-12 gap-gutter-xl items-start">
          
          <div className="col-span-7 flex flex-col gap-gutter-md">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-title-lg text-on-surface" data-design-text-token="title-lg">طلبات بانتظار التأكيد</h2>
              <a href="/orders" className="font-headline text-label-md text-primary" data-design-text-token="label-md">عرض الكل</a>
            </div>

            
            <article data-component-id="card-action" data-component-type="card" data-component-variant="action" className="w-full rounded-lg bg-surface-container-lowest border border-outline-variant p-5 shadow-sm flex flex-col gap-3">
              <header className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-mono-md text-on-surface" data-design-text-token="mono-md">#DZ-8492</span>
                  <span className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">منذ 12 دقيقة</span>
                </div>
                <span className="rounded-full bg-warning-container text-on-warning-container px-2.5 py-0.5 font-body text-label-sm" data-design-text-token="label-sm">قيد التأكيد</span>
              </header>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">أمين بن علي</h3>
                  <p className="font-body text-body-md text-on-surface-variant" data-design-text-token="body-md">16 - الجزائر (باب الزوار) • ساعة ذكية</p>
                </div>
                <span className="font-headline text-title-md text-primary tabular-nums shrink-0" data-design-text-token="title-md">5,100 دج</span>
              </div>
              <footer className="flex items-center gap-2 pt-2 border-t border-outline-variant">
                <button type="button" className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-primary text-on-primary py-2 px-3 font-headline text-label-md hover:bg-success transition-colors duration-state-change">
                  <span className="material-symbols-outlined text-[16px]" aria-hidden="true">check_circle</span>
                  <span data-design-text-token="label-md">تأكيد وإرسال</span>
                </button>
                <button type="button" className="inline-flex items-center justify-center gap-1 rounded-md bg-surface-container-low text-on-surface py-2 px-4 font-headline text-label-md hover:bg-surface-container transition-colors duration-state-change">
                  <span className="material-symbols-outlined text-[16px]" aria-hidden="true">call</span>
                  <span data-design-text-token="label-md">اتصال</span>
                </button>
              </footer>
            </article>

            
            <article data-component-id="card-action" data-component-type="card" data-component-variant="action" className="w-full rounded-lg bg-surface-container-lowest border border-outline-variant p-5 shadow-sm flex flex-col gap-3">
              <header className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-mono-md text-on-surface" data-design-text-token="mono-md">#DZ-8491</span>
                  <span className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">منذ 35 دقيقة</span>
                </div>
                <span className="rounded-full bg-warning-container text-on-warning-container px-2.5 py-0.5 font-body text-label-sm" data-design-text-token="label-sm">محاولة ثانية</span>
              </header>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">خديجة مرابط</h3>
                  <p className="font-body text-body-md text-on-surface-variant" data-design-text-token="body-md">31 - وهران (السانية) • سماعات لاسلكية</p>
                </div>
                <span className="font-headline text-title-md text-primary tabular-nums shrink-0" data-design-text-token="title-md">3,850 دج</span>
              </div>
              <footer className="flex items-center gap-2 pt-2 border-t border-outline-variant">
                <button type="button" className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-primary text-on-primary py-2 px-3 font-headline text-label-md hover:bg-success transition-colors duration-state-change">
                  <span className="material-symbols-outlined text-[16px]" aria-hidden="true">check_circle</span>
                  <span data-design-text-token="label-md">تأكيد وإرسال</span>
                </button>
                <button type="button" className="inline-flex items-center justify-center gap-1 rounded-md bg-surface-container-low text-on-surface py-2 px-4 font-headline text-label-md hover:bg-surface-container transition-colors duration-state-change">
                  <span className="material-symbols-outlined text-[16px]" aria-hidden="true">call</span>
                  <span data-design-text-token="label-md">اتصال</span>
                </button>
              </footer>
            </article>
          </div>

          
          <div className="col-span-5 flex flex-col gap-gutter-md">
            <h2 className="font-headline text-title-lg text-on-surface" data-design-text-token="title-lg">التحصيل المالي</h2>
            <section className="rounded-lg bg-surface-container-lowest border border-outline-variant p-5 shadow-sm flex flex-col gap-gutter-md">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">رصيد التحصيل القادم</h3>
                  <p className="font-body text-label-md text-on-surface-variant text-balance" data-design-text-token="label-md">التحويل يوم الخميس عبر CCP</p>
                </div>
                <span className="font-headline text-headline-md text-primary tabular-nums shrink-0" data-design-text-token="headline-md">126,400 دج</span>
              </div>
              <div className="w-full h-3 rounded-full bg-surface-container-low overflow-hidden">
                <div className="h-full w-3/4 rounded-full bg-accent"></div>
              </div>
              <div className="flex items-center justify-between font-body text-label-sm text-on-surface-variant">
                <span data-design-text-token="label-sm">تم تسليم 31 طلبًا</span>
                <span className="tabular-nums" data-design-text-token="label-sm">75% مؤكد للتحويل</span>
              </div>
            </section>
          </div>
        </section>

      </main>
    </div>

  </div>
</div>
    </>
  );
}
