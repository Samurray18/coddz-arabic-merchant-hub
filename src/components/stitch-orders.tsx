import { BRAND_NAME } from "@/lib/coddz";
import { Link } from "@tanstack/react-router";

export function StitchOrders(){
  return (
    <>
      <div className="lg:hidden">
<div className="min-h-[884px] flex flex-col max-w-md mx-auto bg-surface" data-stitch-vh="min-h-[884px]===min-h-screen">

    
    <header className="sticky top-0 z-30 bg-surface border-b border-outline-variant px-page-margin py-3 flex items-center justify-between gap-gutter-md">
      <div className="flex items-center gap-gutter-sm">
        <div className="w-9 h-9 rounded-md bg-primary text-on-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">monitoring</span>
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

    
    <main className="flex-1 flex flex-col gap-gutter-lg px-page-margin py-5 pb-24">

      
      <div className="flex items-center justify-between gap-gutter-md">
        <div>
          <h1 className="font-headline text-headline-lg-mobile text-on-surface" data-design-text-token="headline-lg-mobile">سجل الطلبات</h1>
          <p className="font-body text-body-md text-on-surface-variant" data-design-text-token="body-md">142 طلبًا هذا الشهر • متابعة الدفع عند الاستلام</p>
        </div>
        
        <button data-component-id="button-secondary" data-component-type="button" data-component-variant="secondary" type="button" className="inline-flex items-center justify-center gap-1.5 rounded-md bg-surface-container-lowest text-primary border border-outline-variant px-3 py-2 font-headline text-label-md transition-colors duration-state-change hover:bg-surface-container-low shrink-0">
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">tune</span>
          <span className="font-body text-label-md" data-design-text-token="label-md">الولاية</span>
        </button>
      </div>

      
      
      <label data-component-id="input-field-icon" data-component-type="input-field" data-component-variant="with-icon" className="flex flex-col gap-1.5 w-full">
        <span className="sr-only font-body text-label-md" data-design-text-token="label-md">ابحث برقم الطلب أو الهاتف</span>
        <div className="relative flex items-center">
          <span className="absolute right-3.5 text-outline pointer-events-none flex items-center" aria-hidden="true">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </span>
          <input id="order-search" type="search" placeholder="ابحث برقم الطلب، اسم الزبون، أو الهاتف..." className="w-full rounded-md border border-outline-variant bg-surface-container-lowest pr-10 pl-3.5 py-2.5 font-body text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none" />
        </div>
      </label>

      
      <div className="flex items-center gap-gutter-sm overflow-x-auto pb-1" role="tablist" aria-label="تصفية حسب الحالة">
        <button type="button" data-filter="all" className="filter-chip rounded-full bg-accent-container text-on-accent-container border border-accent px-3.5 py-1.5 font-body text-label-md shrink-0">
          <span data-design-text-token="label-md">الكل (6)</span>
        </button>
        <button type="button" data-filter="pending" className="filter-chip rounded-full bg-surface-container-lowest text-on-surface-variant border border-outline-variant px-3.5 py-1.5 font-body text-label-md shrink-0 hover:bg-surface-container-low">
          <span data-design-text-token="label-md">قيد التأكيد</span>
        </button>
        <button type="button" data-filter="transit" className="filter-chip rounded-full bg-surface-container-lowest text-on-surface-variant border border-outline-variant px-3.5 py-1.5 font-body text-label-md shrink-0 hover:bg-surface-container-low">
          <span data-design-text-token="label-md">قيد التوصيل</span>
        </button>
        <button type="button" data-filter="delivered" className="filter-chip rounded-full bg-surface-container-lowest text-on-surface-variant border border-outline-variant px-3.5 py-1.5 font-body text-label-md shrink-0 hover:bg-surface-container-low">
          <span data-design-text-token="label-md">تم التسليم</span>
        </button>
        <button type="button" data-filter="returned" className="filter-chip rounded-full bg-surface-container-lowest text-on-surface-variant border border-outline-variant px-3.5 py-1.5 font-body text-label-md shrink-0 hover:bg-surface-container-low">
          <span data-design-text-token="label-md">مرتجع</span>
        </button>
      </div>

      
      
      <div data-component-id="table-interactive" data-component-type="table" data-component-variant="interactive" className="w-full overflow-x-auto rounded-lg border border-outline-variant bg-surface-container-lowest shadow-sm">
        <table className="w-full text-right border-collapse min-w-[540px]">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th scope="col" aria-sort="none" className="py-3 px-3 font-body text-label-md text-on-surface-variant">
                <span data-design-text-token="label-md">الطلب</span>
              </th>
              <th scope="col" aria-sort="none" className="py-3 px-3 font-body text-label-md text-on-surface-variant">
                <span data-design-text-token="label-md">الزبون</span>
              </th>
              <th scope="col" aria-sort="ascending" className="py-3 px-3 font-body text-label-md text-primary">
                <span data-design-text-token="label-md">الولاية</span>
              </th>
              <th scope="col" aria-sort="none" className="py-3 px-3 font-body text-label-md text-on-surface-variant">
                <span data-design-text-token="label-md">المبلغ</span>
              </th>
              <th scope="col" aria-sort="none" className="py-3 px-3 font-body text-label-md text-on-surface-variant">
                <span data-design-text-token="label-md">الحالة</span>
              </th>
            </tr>
          </thead>
          <tbody id="orders-tbody" className="divide-y divide-outline-variant">
            <tr data-status="pending" className="order-row transition-colors duration-state-change hover:bg-surface-container-low">
              <td className="py-3 px-3 font-mono text-mono-md text-on-surface tabular-nums whitespace-nowrap">
                <span data-design-text-token="mono-md">#DZ-8492</span>
              </td>
              <td className="py-3 px-3 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="font-body text-body-md text-on-surface" data-design-text-token="body-md">أمين بن علي</span>
                  <span className="font-mono text-label-sm text-on-surface-variant tabular-nums" dir="ltr" data-design-text-token="label-sm">0551 42 89 10</span>
                </div>
              </td>
              <td className="py-3 px-3 font-body text-body-md text-on-surface whitespace-nowrap">
                <span data-design-text-token="body-md">16 - الجزائر</span>
              </td>
              <td className="py-3 px-3 font-headline text-label-lg text-on-surface tabular-nums whitespace-nowrap">
                <span data-design-text-token="label-lg">5,100 دج</span>
              </td>
              <td className="py-3 px-3 whitespace-nowrap">
                <span className="inline-flex items-center rounded-full bg-warning-container text-on-warning-container px-2.5 py-0.5 font-body text-label-sm" data-design-text-token="label-sm">قيد التأكيد</span>
              </td>
            </tr>

            <tr data-status="delivered" className="order-row transition-colors duration-state-change hover:bg-surface-container-low">
              <td className="py-3 px-3 font-mono text-mono-md text-on-surface tabular-nums whitespace-nowrap">
                <span data-design-text-token="mono-md">#DZ-8491</span>
              </td>
              <td className="py-3 px-3 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="font-body text-body-md text-on-surface" data-design-text-token="body-md">سارة منصوري</span>
                  <span className="font-mono text-label-sm text-on-surface-variant tabular-nums" dir="ltr" data-design-text-token="label-sm">0662 19 04 77</span>
                </div>
              </td>
              <td className="py-3 px-3 font-body text-body-md text-on-surface whitespace-nowrap">
                <span data-design-text-token="body-md">31 - وهران</span>
              </td>
              <td className="py-3 px-3 font-headline text-label-lg text-on-surface tabular-nums whitespace-nowrap">
                <span data-design-text-token="label-lg">4,200 دج</span>
              </td>
              <td className="py-3 px-3 whitespace-nowrap">
                <span className="inline-flex items-center rounded-full bg-success-container text-on-success-container px-2.5 py-0.5 font-body text-label-sm" data-design-text-token="label-sm">تم التسليم</span>
              </td>
            </tr>

            <tr data-status="transit" className="order-row transition-colors duration-state-change hover:bg-surface-container-low">
              <td className="py-3 px-3 font-mono text-mono-md text-on-surface tabular-nums whitespace-nowrap">
                <span data-design-text-token="mono-md">#DZ-8490</span>
              </td>
              <td className="py-3 px-3 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="font-body text-body-md text-on-surface" data-design-text-token="body-md">ياسين قاسمي</span>
                  <span className="font-mono text-label-sm text-on-surface-variant tabular-nums" dir="ltr" data-design-text-token="label-sm">0770 83 55 21</span>
                </div>
              </td>
              <td className="py-3 px-3 font-body text-body-md text-on-surface whitespace-nowrap">
                <span data-design-text-token="body-md">25 - قسنطينة</span>
              </td>
              <td className="py-3 px-3 font-headline text-label-lg text-on-surface tabular-nums whitespace-nowrap">
                <span data-design-text-token="label-lg">6,450 دج</span>
              </td>
              <td className="py-3 px-3 whitespace-nowrap">
                <span className="inline-flex items-center rounded-full bg-primary-container text-on-primary-container px-2.5 py-0.5 font-body text-label-sm" data-design-text-token="label-sm">قيد التوصيل</span>
              </td>
            </tr>

            <tr data-status="delivered" className="order-row transition-colors duration-state-change hover:bg-surface-container-low">
              <td className="py-3 px-3 font-mono text-mono-md text-on-surface tabular-nums whitespace-nowrap">
                <span data-design-text-token="mono-md">#DZ-8489</span>
              </td>
              <td className="py-3 px-3 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="font-body text-body-md text-on-surface" data-design-text-token="body-md">نور الهدى بوزيد</span>
                  <span className="font-mono text-label-sm text-on-surface-variant tabular-nums" dir="ltr" data-design-text-token="label-sm">0549 30 12 64</span>
                </div>
              </td>
              <td className="py-3 px-3 font-body text-body-md text-on-surface whitespace-nowrap">
                <span data-design-text-token="body-md">19 - سطيف</span>
              </td>
              <td className="py-3 px-3 font-headline text-label-lg text-on-surface tabular-nums whitespace-nowrap">
                <span data-design-text-token="label-lg">3,600 دج</span>
              </td>
              <td className="py-3 px-3 whitespace-nowrap">
                <span className="inline-flex items-center rounded-full bg-success-container text-on-success-container px-2.5 py-0.5 font-body text-label-sm" data-design-text-token="label-sm">تم التسليم</span>
              </td>
            </tr>

            <tr data-status="returned" className="order-row transition-colors duration-state-change hover:bg-surface-container-low">
              <td className="py-3 px-3 font-mono text-mono-md text-on-surface tabular-nums whitespace-nowrap">
                <span data-design-text-token="mono-md">#DZ-8488</span>
              </td>
              <td className="py-3 px-3 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="font-body text-body-md text-on-surface" data-design-text-token="body-md">كريم زروقي</span>
                  <span className="font-mono text-label-sm text-on-surface-variant tabular-nums" dir="ltr" data-design-text-token="label-sm">0698 71 44 09</span>
                </div>
              </td>
              <td className="py-3 px-3 font-body text-body-md text-on-surface whitespace-nowrap">
                <span data-design-text-token="body-md">09 - البليدة</span>
              </td>
              <td className="py-3 px-3 font-headline text-label-lg text-on-surface tabular-nums whitespace-nowrap">
                <span data-design-text-token="label-lg">2,900 دج</span>
              </td>
              <td className="py-3 px-3 whitespace-nowrap">
                <span className="inline-flex items-center rounded-full bg-error-container text-on-error-container px-2.5 py-0.5 font-body text-label-sm" data-design-text-token="label-sm">مرتجع</span>
              </td>
            </tr>

            <tr data-status="transit" className="order-row transition-colors duration-state-change hover:bg-surface-container-low">
              <td className="py-3 px-3 font-mono text-mono-md text-on-surface tabular-nums whitespace-nowrap">
                <span data-design-text-token="mono-md">#DZ-8487</span>
              </td>
              <td className="py-3 px-3 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="font-body text-body-md text-on-surface" data-design-text-token="body-md">مريم حداد</span>
                  <span className="font-mono text-label-sm text-on-surface-variant tabular-nums" dir="ltr" data-design-text-token="label-sm">0791 25 60 33</span>
                </div>
              </td>
              <td className="py-3 px-3 font-body text-body-md text-on-surface whitespace-nowrap">
                <span data-design-text-token="body-md">06 - بجاية</span>
              </td>
              <td className="py-3 px-3 font-headline text-label-lg text-on-surface tabular-nums whitespace-nowrap">
                <span data-design-text-token="label-lg">5,350 دج</span>
              </td>
              <td className="py-3 px-3 whitespace-nowrap">
                <span className="inline-flex items-center rounded-full bg-primary-container text-on-primary-container px-2.5 py-0.5 font-body text-label-sm" data-design-text-token="label-sm">قيد التوصيل</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      
      <div className="flex items-center justify-between px-1">
        <span className="font-body text-label-md text-on-surface-variant tabular-nums" data-design-text-token="label-md">عرض 1–6 من أصل 142 طلبًا</span>
        <div className="flex items-center gap-gutter-sm">
          <button type="button" disabled className="rounded-md border border-outline-variant bg-surface-container-low px-3 py-1.5 font-body text-label-md text-on-surface-variant">
            <span data-design-text-token="label-md">السابق</span>
          </button>
          <button type="button" className="rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-1.5 font-body text-label-md text-primary hover:bg-surface-container-low">
            <span data-design-text-token="label-md">التالي</span>
          </button>
        </div>
      </div>

    </main>

    
    <nav aria-label="التنقل الرئيسي" className="fixed bottom-0 inset-x-0 z-30 max-w-md mx-auto bg-surface-container-lowest border-t border-outline-variant px-2 py-2 grid grid-cols-4 gap-1">
      <a href="/dashboard" className="flex flex-col items-center justify-center gap-1 py-1.5 rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors duration-state-change">
        <span className="material-symbols-outlined text-[22px]">dashboard</span>
        <span className="font-body text-label-sm" data-design-text-token="label-sm">الرئيسية</span>
      </a>
      <a href="/orders" aria-current="page" className="flex flex-col items-center justify-center gap-1 py-1.5 rounded-md bg-accent-container text-on-accent-container">
        <span className="material-symbols-outlined text-[22px]" style={{fontVariationSettings: "'FILL' 1"}}>receipt_long</span>
        <span className="font-headline text-label-sm" data-design-text-token="label-sm">الطلبات</span>
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
            <span className="material-symbols-outlined text-[22px]">monitoring</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">متجر النخيل</span>
            <span className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">{BRAND_NAME} • 16 الجزائر</span>
          </div>
        </div>

        <nav aria-label="التنقل الرئيسي" className="flex flex-col gap-gutter-xs">
          <a href="/dashboard" className="flex items-center gap-gutter-md px-3.5 py-2.5 rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors duration-state-change">
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="font-body text-body-md" data-design-text-token="body-md">الرئيسية</span>
          </a>
          <a href="/orders" aria-current="page" className="flex items-center gap-gutter-md px-3.5 py-2.5 rounded-md bg-accent-container text-on-accent-container">
            <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>receipt_long</span>
            <span className="font-headline text-label-lg" data-design-text-token="label-lg">الطلبات</span>
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
          <h1 className="font-headline text-headline-lg text-on-surface" data-design-text-token="headline-lg">سجل الطلبات</h1>
          <p className="font-body text-body-md text-on-surface-variant" data-design-text-token="body-md">142 طلبًا هذا الشهر • متابعة الدفع عند الاستلام</p>
        </div>
        <div className="flex items-center gap-gutter-md">
          
          <button data-component-id="button-icon" data-component-type="button" data-component-variant="icon" type="button" aria-label="الإشعارات" className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface border border-outline-variant transition-colors duration-state-change ease-state-change hover:bg-surface-container-low">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="w-2 h-2 rounded-full bg-accent absolute top-2 right-2"></span>
          </button>
        </div>
      </header>

      
      <main className="flex-1 w-full px-6 py-6 flex flex-col gap-gutter-lg">

        
        <div className="flex flex-wrap items-center justify-between gap-gutter-md">
          
          <label data-component-id="input-field-icon" data-component-type="input-field" data-component-variant="with-icon" className="flex flex-col gap-1.5 w-64">
            <span className="sr-only font-body text-label-md" data-design-text-token="label-md">ابحث برقم الطلب أو الهاتف</span>
            <div className="relative flex items-center">
              <span className="absolute right-3.5 text-outline pointer-events-none flex items-center" aria-hidden="true">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input id="order-search" type="search" placeholder="ابحث برقم الطلب أو الهاتف..." className="w-full rounded-md border border-outline-variant bg-surface-container-lowest pr-10 pl-3.5 py-2.5 font-body text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none" />
            </div>
          </label>

          <div className="flex items-center gap-gutter-xs" role="tablist" aria-label="تصفية حسب الحالة">
            <button type="button" data-filter="all" className="filter-chip rounded-full bg-accent-container text-on-accent-container border border-accent px-3 py-1.5 font-body text-label-md shrink-0">
              <span data-design-text-token="label-md">الكل (6)</span>
            </button>
            <button type="button" data-filter="pending" className="filter-chip rounded-full bg-surface-container-lowest text-on-surface-variant border border-outline-variant px-3 py-1.5 font-body text-label-md shrink-0 hover:bg-surface-container-low">
              <span data-design-text-token="label-md">قيد التأكيد</span>
            </button>
            <button type="button" data-filter="transit" className="filter-chip rounded-full bg-surface-container-lowest text-on-surface-variant border border-outline-variant px-3 py-1.5 font-body text-label-md shrink-0 hover:bg-surface-container-low">
              <span data-design-text-token="label-md">قيد التوصيل</span>
            </button>
            <button type="button" data-filter="delivered" className="filter-chip rounded-full bg-surface-container-lowest text-on-surface-variant border border-outline-variant px-3 py-1.5 font-body text-label-md shrink-0 hover:bg-surface-container-low">
              <span data-design-text-token="label-md">تم التسليم</span>
            </button>
            <button type="button" data-filter="returned" className="filter-chip rounded-full bg-surface-container-lowest text-on-surface-variant border border-outline-variant px-3 py-1.5 font-body text-label-md shrink-0 hover:bg-surface-container-low">
              <span data-design-text-token="label-md">مرتجع</span>
            </button>
          </div>

          
          <button data-component-id="button-secondary" data-component-type="button" data-component-variant="secondary" type="button" className="inline-flex items-center justify-center gap-1.5 rounded-md bg-surface-container-lowest text-primary border border-outline-variant px-3.5 py-2.5 font-body text-label-md transition-colors duration-state-change hover:bg-surface-container-low shrink-0">
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">tune</span>
            <span data-design-text-token="label-md">الولاية</span>
          </button>
        </div>

        
        
        <div data-component-id="table-interactive" data-component-type="table" data-component-variant="interactive" className="w-full overflow-x-auto rounded-lg border border-outline-variant bg-surface-container-lowest shadow-sm">
          <table className="w-full text-right border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th scope="col" aria-sort="none" className="py-3.5 px-4 font-body text-label-md text-on-surface-variant">
                  <span data-design-text-token="label-md">الطلب</span>
                </th>
                <th scope="col" aria-sort="none" className="py-3.5 px-4 font-body text-label-md text-on-surface-variant">
                  <span data-design-text-token="label-md">الزبون</span>
                </th>
                <th scope="col" aria-sort="none" className="py-3.5 px-4 font-body text-label-md text-on-surface-variant">
                  <span data-design-text-token="label-md">الهاتف</span>
                </th>
                <th scope="col" aria-sort="ascending" className="py-3.5 px-4 font-body text-label-md text-primary">
                  <span data-design-text-token="label-md">الولاية</span>
                </th>
                <th scope="col" aria-sort="none" className="py-3.5 px-4 font-body text-label-md text-on-surface-variant">
                  <span data-design-text-token="label-md">المبلغ</span>
                </th>
                <th scope="col" aria-sort="none" className="py-3.5 px-4 font-body text-label-md text-on-surface-variant">
                  <span data-design-text-token="label-md">الحالة</span>
                </th>
              </tr>
            </thead>
            <tbody id="orders-tbody" className="divide-y divide-outline-variant">
              <tr data-status="pending" className="order-row transition-colors duration-state-change hover:bg-surface-container-low">
                <td className="py-3.5 px-4 font-mono text-mono-md text-on-surface tabular-nums">
                  <span data-design-text-token="mono-md">#DZ-8492</span>
                </td>
                <td className="py-3.5 px-4 font-body text-body-md text-on-surface">
                  <span data-design-text-token="body-md">أمين بن علي</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-mono-md text-on-surface-variant tabular-nums" dir="ltr">
                  <span data-design-text-token="mono-md">0551 42 89 10</span>
                </td>
                <td className="py-3.5 px-4 font-body text-body-md text-on-surface">
                  <span data-design-text-token="body-md">16 - الجزائر</span>
                </td>
                <td className="py-3.5 px-4 font-headline text-label-lg text-on-surface tabular-nums">
                  <span data-design-text-token="label-lg">5,100 دج</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center rounded-full bg-warning-container text-on-warning-container px-2.5 py-0.5 font-body text-label-sm" data-design-text-token="label-sm">قيد التأكيد</span>
                </td>
              </tr>

              <tr data-status="delivered" className="order-row transition-colors duration-state-change hover:bg-surface-container-low">
                <td className="py-3.5 px-4 font-mono text-mono-md text-on-surface tabular-nums">
                  <span data-design-text-token="mono-md">#DZ-8491</span>
                </td>
                <td className="py-3.5 px-4 font-body text-body-md text-on-surface">
                  <span data-design-text-token="body-md">سارة منصوري</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-mono-md text-on-surface-variant tabular-nums" dir="ltr">
                  <span data-design-text-token="mono-md">0662 19 04 77</span>
                </td>
                <td className="py-3.5 px-4 font-body text-body-md text-on-surface">
                  <span data-design-text-token="body-md">31 - وهران</span>
                </td>
                <td className="py-3.5 px-4 font-headline text-label-lg text-on-surface tabular-nums">
                  <span data-design-text-token="label-lg">4,200 دج</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center rounded-full bg-success-container text-on-success-container px-2.5 py-0.5 font-body text-label-sm" data-design-text-token="label-sm">تم التسليم</span>
                </td>
              </tr>

              <tr data-status="transit" className="order-row transition-colors duration-state-change hover:bg-surface-container-low">
                <td className="py-3.5 px-4 font-mono text-mono-md text-on-surface tabular-nums">
                  <span data-design-text-token="mono-md">#DZ-8490</span>
                </td>
                <td className="py-3.5 px-4 font-body text-body-md text-on-surface">
                  <span data-design-text-token="body-md">ياسين قاسمي</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-mono-md text-on-surface-variant tabular-nums" dir="ltr">
                  <span data-design-text-token="mono-md">0770 83 55 21</span>
                </td>
                <td className="py-3.5 px-4 font-body text-body-md text-on-surface">
                  <span data-design-text-token="body-md">25 - قسنطينة</span>
                </td>
                <td className="py-3.5 px-4 font-headline text-label-lg text-on-surface tabular-nums">
                  <span data-design-text-token="label-lg">6,450 دج</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center rounded-full bg-primary-container text-on-primary-container px-2.5 py-0.5 font-body text-label-sm" data-design-text-token="label-sm">قيد التوصيل</span>
                </td>
              </tr>

              <tr data-status="delivered" className="order-row transition-colors duration-state-change hover:bg-surface-container-low">
                <td className="py-3.5 px-4 font-mono text-mono-md text-on-surface tabular-nums">
                  <span data-design-text-token="mono-md">#DZ-8489</span>
                </td>
                <td className="py-3.5 px-4 font-body text-body-md text-on-surface">
                  <span data-design-text-token="body-md">نور الهدى بوزيد</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-mono-md text-on-surface-variant tabular-nums" dir="ltr">
                  <span data-design-text-token="mono-md">0549 30 12 64</span>
                </td>
                <td className="py-3.5 px-4 font-body text-body-md text-on-surface">
                  <span data-design-text-token="body-md">19 - سطيف</span>
                </td>
                <td className="py-3.5 px-4 font-headline text-label-lg text-on-surface tabular-nums">
                  <span data-design-text-token="label-lg">3,600 دج</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center rounded-full bg-success-container text-on-success-container px-2.5 py-0.5 font-body text-label-sm" data-design-text-token="label-sm">تم التسليم</span>
                </td>
              </tr>

              <tr data-status="returned" className="order-row transition-colors duration-state-change hover:bg-surface-container-low">
                <td className="py-3.5 px-4 font-mono text-mono-md text-on-surface tabular-nums">
                  <span data-design-text-token="mono-md">#DZ-8488</span>
                </td>
                <td className="py-3.5 px-4 font-body text-body-md text-on-surface">
                  <span data-design-text-token="body-md">كريم زروقي</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-mono-md text-on-surface-variant tabular-nums" dir="ltr">
                  <span data-design-text-token="mono-md">0698 71 44 09</span>
                </td>
                <td className="py-3.5 px-4 font-body text-body-md text-on-surface">
                  <span data-design-text-token="body-md">09 - البليدة</span>
                </td>
                <td className="py-3.5 px-4 font-headline text-label-lg text-on-surface tabular-nums">
                  <span data-design-text-token="label-lg">2,900 دج</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center rounded-full bg-error-container text-on-error-container px-2.5 py-0.5 font-body text-label-sm" data-design-text-token="label-sm">مرتجع</span>
                </td>
              </tr>

              <tr data-status="transit" className="order-row transition-colors duration-state-change hover:bg-surface-container-low">
                <td className="py-3.5 px-4 font-mono text-mono-md text-on-surface tabular-nums">
                  <span data-design-text-token="mono-md">#DZ-8487</span>
                </td>
                <td className="py-3.5 px-4 font-body text-body-md text-on-surface">
                  <span data-design-text-token="body-md">مريم حداد</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-mono-md text-on-surface-variant tabular-nums" dir="ltr">
                  <span data-design-text-token="mono-md">0791 25 60 33</span>
                </td>
                <td className="py-3.5 px-4 font-body text-body-md text-on-surface">
                  <span data-design-text-token="body-md">06 - بجاية</span>
                </td>
                <td className="py-3.5 px-4 font-headline text-label-lg text-on-surface tabular-nums">
                  <span data-design-text-token="label-lg">5,350 دج</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center rounded-full bg-primary-container text-on-primary-container px-2.5 py-0.5 font-body text-label-sm" data-design-text-token="label-sm">قيد التوصيل</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        
        <div className="flex items-center justify-between px-1">
          <span className="font-body text-label-md text-on-surface-variant tabular-nums" data-design-text-token="label-md">عرض 1–6 من أصل 142 طلبًا</span>
          <div className="flex items-center gap-gutter-sm">
            <button type="button" disabled className="rounded-md border border-outline-variant bg-surface-container-low px-3.5 py-1.5 font-body text-label-md text-on-surface-variant">
              <span data-design-text-token="label-md">السابق</span>
            </button>
            <button type="button" className="rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-1.5 font-body text-label-md text-primary hover:bg-surface-container-low">
              <span data-design-text-token="label-md">التالي</span>
            </button>
          </div>
        </div>

      </main>
    </div>

  </div>
</div>
    </>
  );
}
