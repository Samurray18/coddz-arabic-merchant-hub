import { Link } from "@tanstack/react-router";

export function StitchCheckout(){
  return (
    <>
      <div className="lg:hidden">
<div className="min-h-[884px] flex flex-col max-w-md mx-auto bg-surface" data-stitch-vh="min-h-[884px]===min-h-screen">

    
    <header className="sticky top-0 z-30 bg-surface border-b border-outline-variant px-page-margin py-3 flex items-center justify-between gap-gutter-md">
      <div className="flex items-center gap-gutter-sm">
        
        <a href="../landing-page/LandingPage.html" data-component-id="button-icon" data-component-type="button" data-component-variant="icon" aria-label="العودة" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface border border-outline-variant transition-colors duration-state-change ease-state-change hover:bg-surface-container-low">
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </a>
        <div>
          <h1 className="font-headline text-title-lg text-on-surface" data-design-text-token="title-lg">إتمام الطلب</h1>
          <p className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">متجر النخيل • طلب سريع</p>
        </div>
      </div>

      <div className="inline-flex items-center gap-1 rounded-full bg-accent-container text-on-accent-container px-2.5 py-1">
        <span className="material-symbols-outlined text-[16px]" aria-hidden="true">payments</span>
        <span className="font-body text-label-sm" data-design-text-token="label-sm">دفع عند الاستلام</span>
      </div>
    </header>

    
    <main className="flex-1 flex flex-col gap-gutter-xl px-page-margin py-5 pb-36">

      
      
      <article data-component-id="card-elevated" data-component-type="card" data-component-variant="elevated" className="w-full rounded-lg bg-surface-container-lowest border border-outline-variant p-4 shadow-sm flex items-center gap-gutter-md">
        <img src="/images/checkout-product.png" alt="ساعة ذكية رياضية مقاومة للماء" className="w-20 h-20 rounded-md object-cover border border-outline-variant shrink-0" />
        <div className="flex-1 flex flex-col gap-1">
          <h2 className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">ساعة ذكية رياضية Pro</h2>
          <p className="font-body text-label-md text-on-surface-variant" data-design-text-token="label-md">اللون: أسود مطفي • ضمان سنة</p>
          <div className="flex items-center justify-between pt-1">
            <span className="font-headline text-title-md text-primary tabular-nums" data-design-text-token="title-md">4,500 دج</span>
            <div className="inline-flex items-center gap-2 rounded-md border border-outline-variant bg-surface-container-low px-2 py-1">
              <button type="button" id="qty-minus" aria-label="إنقاص الكمية" className="w-6 h-6 flex items-center justify-center rounded-sm text-on-surface hover:bg-surface-container font-headline text-label-lg">-</button>
              <span id="qty-val" className="font-headline text-label-lg text-on-surface tabular-nums px-1" data-design-text-token="label-lg">1</span>
              <button type="button" id="qty-plus" aria-label="زيادة الكمية" className="w-6 h-6 flex items-center justify-center rounded-sm text-on-surface hover:bg-surface-container font-headline text-label-lg">+</button>
            </div>
          </div>
        </div>
      </article>

      
      <section className="flex flex-col gap-gutter-md">
        <h2 className="font-headline text-title-lg text-on-surface" data-design-text-token="title-lg">معلومات المستلم</h2>

        
        <label data-component-id="input-field-text" data-component-type="input-field" data-component-variant="text" className="flex flex-col gap-1.5 w-full">
          <span className="font-body text-label-md text-on-surface" data-design-text-token="label-md">الاسم الكامل</span>
          <input type="text" placeholder="مثال: أمين بن علي" className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 font-body text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none" />
        </label>

        
        <label data-component-id="input-field-icon" data-component-type="input-field" data-component-variant="with-icon" className="flex flex-col gap-1.5 w-full">
          <span className="font-body text-label-md text-on-surface" data-design-text-token="label-md">رقم الهاتف</span>
          <div className="relative flex items-center">
            <span className="absolute right-3.5 text-outline pointer-events-none flex items-center" aria-hidden="true">
              <span className="material-symbols-outlined text-[20px]">call</span>
            </span>
            <input type="tel" placeholder="0551 42 89 10" inputMode="numeric" dir="ltr" className="w-full rounded-md border border-outline-variant bg-surface-container-lowest pr-10 pl-3.5 py-2.5 font-mono text-mono-md text-on-surface text-right placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none" />
          </div>
          <span className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">سيتصل بك الموزع قبل التوصيل</span>
        </label>

        <div className="grid grid-cols-2 gap-gutter-md">
          <label className="flex flex-col gap-1.5 w-full">
            <span className="font-body text-label-md text-on-surface" data-design-text-token="label-md">الولاية</span>
            <select className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none">
              <option value="16">16 - الجزائر</option>
              <option value="31">31 - وهران</option>
              <option value="25">25 - قسنطينة</option>
              <option value="19">19 - سطيف</option>
              <option value="09">09 - البليدة</option>
              <option value="06">06 - بجاية</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 w-full">
            <span className="font-body text-label-md text-on-surface" data-design-text-token="label-md">البلدية</span>
            <input type="text" placeholder="باب الزوار" className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2.5 font-body text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none" />
          </label>
        </div>

        
        <label data-component-id="input-field-text" data-component-type="input-field" data-component-variant="text" className="flex flex-col gap-1.5 w-full">
          <span className="font-body text-label-md text-on-surface" data-design-text-token="label-md">العنوان التفصيلي</span>
          <input type="text" placeholder="الحي، رقم العمارة أو معلم قريب" className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 font-body text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none" />
        </label>
      </section>

      
      <section className="flex flex-col gap-gutter-md">
        <h2 className="font-headline text-title-lg text-on-surface" data-design-text-token="title-lg">طريقة التوصيل</h2>

        
        <div role="button" tabIndex={0} data-delivery="home" data-fee="600" data-component-id="card-interactive-selected" data-component-type="card" data-component-variant="interactive-selected" className="delivery-option w-full rounded-lg bg-accent-container border-2 border-primary p-4 flex flex-col gap-1.5 cursor-pointer transition-colors duration-state-change">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary" aria-hidden="true">home</span>
              <h3 className="font-headline text-title-md text-on-accent-container" data-design-text-token="title-md">توصيل للمنزل</h3>
            </div>
            <span className="font-headline text-label-lg text-primary tabular-nums" data-design-text-token="label-lg">600 دج</span>
          </header>
          <p className="font-body text-body-md text-on-accent-container" data-design-text-token="body-md">يصلك المندوب إلى باب المنزل خلال 24–48 ساعة.</p>
        </div>

        
        <div role="button" tabIndex={0} data-delivery="desk" data-fee="350" data-component-id="card-interactive-2" data-component-type="card" data-component-variant="interactive" className="delivery-option w-full rounded-lg bg-surface-container-lowest border border-outline-variant p-4 flex flex-col gap-1.5 cursor-pointer transition-colors duration-state-change hover:border-primary">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant" aria-hidden="true">store</span>
              <h3 className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">استلام من المكتب (Stop Desk)</h3>
            </div>
            <span className="font-headline text-label-lg text-primary tabular-nums" data-design-text-token="label-lg">350 دج</span>
          </header>
          <p className="font-body text-body-md text-on-surface-variant" data-design-text-token="body-md">استلم طلبك في أي وقت من مكتب التوصيل في ولايتك.</p>
        </div>
      </section>

      
      <section className="rounded-lg bg-surface-container-low border border-outline-variant p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between font-body text-body-md text-on-surface-variant">
          <span data-design-text-token="body-md">سعر المنتج</span>
          <span id="subtotal-text" className="tabular-nums" data-design-text-token="body-md">4,500 دج</span>
        </div>
        <div className="flex items-center justify-between font-body text-body-md text-on-surface-variant">
          <span data-design-text-token="body-md">رسوم التوصيل</span>
          <span id="shipping-text" className="tabular-nums" data-design-text-token="body-md">600 دج</span>
        </div>
        <div className="border-t border-outline-variant pt-2 flex items-center justify-between">
          <span className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">المبلغ الإجمالي عند الاستلام</span>
          <span id="total-text" className="font-headline text-headline-md text-primary tabular-nums" data-design-text-token="headline-md">5,100 دج</span>
        </div>
      </section>

    </main>

    
    <div className="fixed bottom-0 inset-x-0 z-30 max-w-md mx-auto bg-surface-container-lowest border-t border-outline-variant px-page-margin py-3.5 shadow-lg flex flex-col gap-2">
      
      <button id="confirm-order-btn" data-component-id="button-primary" data-component-type="button" data-component-variant="primary" type="button" className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary text-on-primary px-5 py-3.5 font-headline text-label-lg transition-colors duration-state-change ease-state-change hover:bg-success active:scale-[0.98]">
        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">verified_user</span>
        <span id="cta-label" data-design-text-token="label-lg">تأكيد الطلب الآن — 5,100 دج</span>
      </button>
      <p className="font-body text-label-sm text-on-surface-variant text-center" data-design-text-token="label-sm">
        لا يُطلب منك أي دفع مسبق • ادفع نقدًا بعد فحص طلبك
      </p>
    </div>

  </div>
</div>
      <div className="hidden lg:block">
<div className="min-h-[1024px] flex flex-col bg-surface" data-stitch-vh="min-h-[1024px]===min-h-screen">

    
    <header className="sticky top-0 z-30 bg-surface border-b border-outline-variant">
      <div className="max-w-5xl mx-auto px-gutter-xl py-4 flex items-center justify-between gap-gutter-md">
        <div className="flex items-center gap-gutter-md">
          
          <a href="../landing-page-desktop/LandingPageDesktop.html" data-component-id="button-icon" data-component-type="button" data-component-variant="icon" aria-label="العودة" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface border border-outline-variant transition-colors duration-state-change ease-state-change hover:bg-surface-container-low">
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </a>
          <div>
            <h1 className="font-headline text-title-lg text-on-surface" data-design-text-token="title-lg">إتمام الطلب</h1>
            <p className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">متجر النخيل • طلب سريع</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-container text-on-accent-container px-3.5 py-1.5">
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">payments</span>
          <span className="font-body text-label-md" data-design-text-token="label-md">دفع عند الاستلام</span>
        </div>
      </div>
    </header>

    
    <main className="flex-1 max-w-5xl w-full mx-auto px-gutter-xl py-8 grid grid-cols-12 gap-gutter-xl items-start">

      
      <div className="col-span-7 flex flex-col gap-gutter-xl">
        
        <section className="rounded-lg bg-surface-container-lowest border border-outline-variant p-6 shadow-sm flex flex-col gap-gutter-md">
          <h2 className="font-headline text-title-lg text-on-surface" data-design-text-token="title-lg">معلومات المستلم</h2>

          
          <label data-component-id="input-field-text" data-component-type="input-field" data-component-variant="text" className="flex flex-col gap-1.5 w-full">
            <span className="font-body text-label-md text-on-surface" data-design-text-token="label-md">الاسم الكامل</span>
            <input type="text" placeholder="مثال: أمين بن علي" className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 font-body text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none" />
          </label>

          
          <label data-component-id="input-field-icon" data-component-type="input-field" data-component-variant="with-icon" className="flex flex-col gap-1.5 w-full">
            <span className="font-body text-label-md text-on-surface" data-design-text-token="label-md">رقم الهاتف</span>
            <div className="relative flex items-center">
              <span className="absolute right-3.5 text-outline pointer-events-none flex items-center" aria-hidden="true">
                <span className="material-symbols-outlined text-[20px]">call</span>
              </span>
              <input type="tel" placeholder="0551 42 89 10" inputMode="numeric" dir="ltr" className="w-full rounded-md border border-outline-variant bg-surface-container-lowest pr-10 pl-3.5 py-2.5 font-mono text-mono-md text-on-surface text-right placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none" />
            </div>
            <span className="font-body text-label-sm text-on-surface-variant" data-design-text-token="label-sm">سيتصل بك الموزع قبل التوصيل</span>
          </label>

          <div className="grid grid-cols-2 gap-gutter-md">
            <label className="flex flex-col gap-1.5 w-full">
              <span className="font-body text-label-md text-on-surface" data-design-text-token="label-md">الولاية</span>
              <select className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2.5 font-body text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none">
                <option value="16">16 - الجزائر</option>
                <option value="31">31 - وهران</option>
                <option value="25">25 - قسنطينة</option>
                <option value="19">19 - سطيف</option>
                <option value="09">09 - البليدة</option>
                <option value="06">06 - بجاية</option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5 w-full">
              <span className="font-body text-label-md text-on-surface" data-design-text-token="label-md">البلدية</span>
              <input type="text" placeholder="باب الزوار" className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2.5 font-body text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none" />
            </label>
          </div>

          
          <label data-component-id="input-field-text" data-component-type="input-field" data-component-variant="text" className="flex flex-col gap-1.5 w-full">
            <span className="font-body text-label-md text-on-surface" data-design-text-token="label-md">العنوان التفصيلي</span>
            <input type="text" placeholder="الحي، رقم العمارة أو معلم قريب" className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 font-body text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-accent focus:outline-none" />
          </label>
        </section>

        
        <section className="flex flex-col gap-gutter-md">
          <h2 className="font-headline text-title-lg text-on-surface" data-design-text-token="title-lg">طريقة التوصيل</h2>

          <div className="grid grid-cols-2 gap-gutter-md items-stretch">
            
            <div role="button" tabIndex={0} data-delivery="home" data-fee="600" data-component-id="card-interactive-selected" data-component-type="card" data-component-variant="interactive-selected" className="delivery-option h-full rounded-lg bg-accent-container border-2 border-primary p-4 flex flex-col justify-between gap-2 cursor-pointer transition-colors duration-state-change">
              <header className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary" aria-hidden="true">home</span>
                  <h3 className="font-headline text-title-md text-on-accent-container" data-design-text-token="title-md">توصيل للمنزل</h3>
                </div>
                <span className="font-headline text-label-lg text-primary tabular-nums" data-design-text-token="label-lg">600 دج</span>
              </header>
              <p className="font-body text-body-md text-on-accent-container" data-design-text-token="body-md">يصلك المندوب إلى باب المنزل خلال 24–48 ساعة.</p>
            </div>

            
            <div role="button" tabIndex={0} data-delivery="desk" data-fee="350" data-component-id="card-interactive-2" data-component-type="card" data-component-variant="interactive" className="delivery-option h-full rounded-lg bg-surface-container-lowest border border-outline-variant p-4 flex flex-col justify-between gap-2 cursor-pointer transition-colors duration-state-change hover:border-primary">
              <header className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant" aria-hidden="true">store</span>
                  <h3 className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">استلام من المكتب</h3>
                </div>
                <span className="font-headline text-label-lg text-primary tabular-nums" data-design-text-token="label-lg">350 دج</span>
              </header>
              <p className="font-body text-body-md text-on-surface-variant" data-design-text-token="body-md">استلم طلبك في أي وقت من مكتب التوصيل في ولايتك.</p>
            </div>
          </div>
        </section>
      </div>

      
      <aside className="col-span-5 sticky top-24 flex flex-col gap-gutter-lg">
        
        
        <article data-component-id="card-elevated" data-component-type="card" data-component-variant="elevated" className="w-full rounded-lg bg-surface-container-lowest border border-outline-variant p-5 shadow-sm flex items-center gap-gutter-md">
          <img src="/images/checkout-product.png" alt="ساعة ذكية رياضية مقاومة للماء" className="w-20 h-20 rounded-md object-cover border border-outline-variant shrink-0" />
          <div className="flex-1 flex flex-col gap-1">
            <h2 className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">ساعة ذكية رياضية Pro</h2>
            <p className="font-body text-label-md text-on-surface-variant" data-design-text-token="label-md">اللون: أسود مطفي • ضمان سنة</p>
            <div className="flex items-center justify-between pt-1">
              <span className="font-headline text-title-md text-primary tabular-nums" data-design-text-token="title-md">4,500 دج</span>
              <div className="inline-flex items-center gap-2 rounded-md border border-outline-variant bg-surface-container-low px-2 py-1">
                <button type="button" id="qty-minus" aria-label="إنقاص الكمية" className="w-6 h-6 flex items-center justify-center rounded-sm text-on-surface hover:bg-surface-container font-headline text-label-lg">-</button>
                <span id="qty-val" className="font-headline text-label-lg text-on-surface tabular-nums px-1" data-design-text-token="label-lg">1</span>
                <button type="button" id="qty-plus" aria-label="زيادة الكمية" className="w-6 h-6 flex items-center justify-center rounded-sm text-on-surface hover:bg-surface-container font-headline text-label-lg">+</button>
              </div>
            </div>
          </div>
        </article>

        
        <section className="rounded-lg bg-surface-container-lowest border border-outline-variant p-5 shadow-sm flex flex-col gap-gutter-md">
          <h2 className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">ملخص الفاتورة</h2>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between font-body text-body-md text-on-surface-variant">
              <span data-design-text-token="body-md">سعر المنتج</span>
              <span id="subtotal-text" className="tabular-nums" data-design-text-token="body-md">4,500 دج</span>
            </div>
            <div className="flex items-center justify-between font-body text-body-md text-on-surface-variant">
              <span data-design-text-token="body-md">رسوم التوصيل</span>
              <span id="shipping-text" className="tabular-nums" data-design-text-token="body-md">600 دج</span>
            </div>
            <div className="border-t border-outline-variant pt-3 flex items-center justify-between">
              <span className="font-headline text-title-md text-on-surface" data-design-text-token="title-md">المبلغ الإجمالي</span>
              <span id="total-text" className="font-headline text-headline-md text-primary tabular-nums" data-design-text-token="headline-md">5,100 دج</span>
            </div>
          </div>

          
          <button id="confirm-order-btn" data-component-id="button-primary" data-component-type="button" data-component-variant="primary" type="button" className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary text-on-primary px-5 py-3.5 font-headline text-label-lg transition-colors duration-state-change ease-state-change hover:bg-success active:scale-[0.98]">
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">verified_user</span>
            <span id="cta-label" data-design-text-token="label-lg">تأكيد الطلب الآن — 5,100 دج</span>
          </button>

          <p className="font-body text-label-sm text-on-surface-variant text-center" data-design-text-token="label-sm">
            لا يُطلب منك أي دفع مسبق • ادفع نقدًا بعد فحص طلبك
          </p>
        </section>
      </aside>

    </main>

  </div>
</div>
    </>
  );
}
