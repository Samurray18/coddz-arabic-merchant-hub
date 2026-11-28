import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/use-language";
import { BRAND_NAME, BRAND_NAME_AR } from "@/lib/coddz";
import { BrandMark } from "@/components/brand-logo";
import { PLANS } from "@/config/plans";

const CARRIERS = [
  { key: "yalidine", name: "Yalidine" },
  { key: "zrexpress", name: "ZR Express" },
  { key: "dhd", name: "DHD" },
  { key: "noest", name: "Noest" },
  { key: "maystro", name: "Maystro" },
  { key: "procolis", name: "Procolis" },
  { key: "ecotrack", name: "Ecotrack" },
  { key: "guepex", name: "Guepex" },
];
const LOGO_EXT: Record<string, string> = { yalidine: "png", zrexpress: "svg", dhd: "png", noest: "png", maystro: "svg", ecotrack: "png" };

export function LandingPage() {
  const { lang, setLang, t } = useLanguage();
  const brand = lang === "ar" ? BRAND_NAME_AR : BRAND_NAME;

  const stats = [
    t.landing.statTracking,
    t.landing.statProfit,
    t.landing.statWilayasPriced,
  ];
  const features = [
    { icon: "receipt_long", title: t.landing.featureOrdersTitle, desc: t.landing.featureOrdersDesc },
    { icon: "call", title: t.landing.featureCallCenterTitle, desc: t.landing.featureCallCenterDesc },
    { icon: "shield", title: t.landing.featureFakeOrdersTitle, desc: t.landing.featureFakeOrdersDesc },
    { icon: "local_shipping", title: t.landing.featureDeliveryTitle, desc: t.landing.featureDeliveryDesc },
    { icon: "inventory_2", title: t.nav.inventory, desc: t.landing.featureInventoryDesc },
    { icon: "analytics", title: t.landing.featureAnalyticsTitle, desc: t.landing.featureAnalyticsDesc },
    { icon: "api", title: t.landing.featureStoreIntegrationTitle, desc: t.landing.featureStoreIntegrationDesc },
    { icon: "sms", title: t.landing.featureSmsWhatsappTitle, desc: t.landing.featureSmsWhatsappDesc },
    { icon: "group", title: t.landing.featureTeamTitle, desc: t.landing.featureTeamDesc },
  ];
  const steps = [
    t.landing.stepConnect,
    t.landing.stepConfirm,
    t.landing.stepTrack,
  ];
  const faq = [
    { q: t.landing.faq1Q, a: t.landing.faq1A },
    { q: t.landing.faq2Q, a: t.landing.faq2A },
    { q: t.landing.faq3Q, a: t.landing.faq3A },
    { q: t.landing.faq4Q, a: t.landing.faq4A },
    { q: t.landing.faq5Q, a: t.landing.faq5A },
  ];
  const planCopy = {
    starter: { orderLimit: t.plans.starterOrderLimit, features: t.plans.starterFeatures },
    pro: { orderLimit: t.plans.proOrderLimit, features: t.plans.proFeatures },
    business: { orderLimit: t.plans.businessOrderLimit, features: t.plans.businessFeatures },
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-body">
      <header className="sticky top-0 z-30 bg-surface border-b border-outline-variant">
        <div className="max-w-6xl mx-auto px-gutter-xl py-4 flex items-center justify-between gap-gutter-lg">
          <div className="flex items-center gap-gutter-sm">
            <BrandMark size={40} />
            <span className="font-display text-title-lg text-on-surface" style={{ fontWeight: 800 }}>{brand}</span>
          </div>
          <nav className="hidden md:flex items-center gap-gutter-xl">
            <a href="#features" className="font-body text-body-md text-on-surface-variant hover:text-primary transition-colors">{t.landing.featuresHeading}</a>
            <a href="#pricing" className="font-body text-body-md text-on-surface-variant hover:text-primary transition-colors">{t.landing.pricingHeading}</a>
          </nav>
          <div className="flex items-center gap-gutter-md">
            <select value={lang} onChange={(e) => setLang(e.target.value as "ar" | "fr" | "en")} className="rounded-md border border-outline-variant bg-surface px-2 py-1 text-sm">
              <option value="ar">AR</option>
              <option value="fr">FR</option>
              <option value="en">EN</option>
            </select>
            <Link to="/auth" className="font-headline text-label-lg text-primary px-3 py-2 rounded-md hover:bg-surface-container-low transition-colors">
              {t.nav.signIn}
            </Link>
            <Link to="/signup" className="inline-flex items-center justify-center rounded-md bg-primary text-on-primary px-5 py-2.5 font-headline text-label-lg transition-colors hover:bg-success">
              {t.landing.ctaStartFree}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-gutter-xl py-12 flex flex-col gap-14">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-xl items-center">
          <div className="flex flex-col gap-gutter-lg">
            <div className="inline-flex self-start items-center gap-gutter-xs rounded-full bg-accent-container text-on-accent-container px-3 py-1">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span className="font-body text-label-md">{t.landing.badge}</span>
            </div>
            <h1 className="font-display text-display-lg text-on-surface text-balance">{t.landing.heroTitle}</h1>
            <p className="font-body text-body-lg text-on-surface-variant text-pretty max-w-prose">{t.landing.heroSub}</p>
            <div className="flex items-center gap-gutter-md pt-2">
              <Link to="/signup" className="inline-flex items-center justify-center rounded-md bg-primary text-on-primary px-6 py-3.5 font-headline text-label-lg transition-colors hover:bg-success">
                {t.landing.ctaStartFree}
              </Link>
              <a href="#how" className="inline-flex items-center justify-center rounded-md bg-surface-container-lowest text-primary border border-outline-variant px-6 py-3.5 font-headline text-label-lg transition-colors hover:bg-surface-container-low">
                {t.nav.howItWorks}
              </a>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-outline-variant bg-surface-container-lowest shadow-sm">
            <img src="/images/hero-box-phone.png" alt={t.landing.heroTitle} className="w-full h-80 object-cover" />
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg">
          {stats.map((s) => (
            <div key={s} className="rounded-lg bg-surface-container-lowest border border-outline-variant p-6 text-center">
              <span className="font-headline text-headline-md text-primary">{s}</span>
            </div>
          ))}
        </section>

        {/* Features */}
        <section id="features" className="flex flex-col gap-gutter-lg">
          <h2 className="font-headline text-headline-lg text-on-surface">{t.landing.featuresHeading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg">
            {features.map((f) => (
              <article key={f.title} className="rounded-lg bg-surface-container-lowest border border-outline-variant p-5 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-md bg-accent-container text-on-accent-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{f.icon}</span>
                  </span>
                  <h3 className="font-headline text-title-lg text-on-surface">{f.title}</h3>
                </div>
                <p className="font-body text-body-md text-on-surface-variant text-pretty">{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section id="how" className="flex flex-col gap-gutter-lg">
          <h2 className="font-headline text-headline-lg text-on-surface">{t.nav.howItWorks}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg">
            {steps.map((s, i) => (
              <div key={s} className="rounded-lg bg-surface-container-lowest border border-outline-variant p-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline text-label-lg shrink-0">{i + 1}</span>
                <span className="font-body text-body-md text-on-surface">{s}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Carriers */}
        <section className="flex flex-col gap-gutter-lg">
          <h2 className="font-headline text-headline-lg text-on-surface">{t.landing.carriersHeading}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CARRIERS.map((carr) => {
              const ext = LOGO_EXT[carr.key];
              return (
                <div key={carr.key} className="h-24 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 flex items-center justify-center">
                  {ext ? (
                    <img src={`/images/carriers/${carr.key}.${ext}`} alt={carr.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="font-headline text-label-md text-on-surface">{carr.name}</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="flex flex-col gap-gutter-lg">
          <h2 className="font-headline text-headline-lg text-on-surface">{t.landing.pricingHeading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg">
            {PLANS.map((p) => (
              <article key={p.name} className={`rounded-xl border p-6 flex flex-col gap-3 ${p.highlighted ? "bg-primary text-on-primary border-primary" : "bg-surface-container-lowest border-outline-variant"}`}>
                <h3 className="font-headline text-title-lg">{p.name}</h3>
                <div className="font-headline text-headline-md tabular-nums">{t.landing.pricePerMonth.replace("{amount}", String(p.priceDzd))}</div>
                <div className="font-body text-body-md">{planCopy[p.copyKey].orderLimit}</div>
                <ul className="flex flex-col gap-1">
                  {planCopy[p.copyKey].features.map((f) => (
                    <li key={f} className="font-body text-body-md">• {f}</li>
                  ))}
                </ul>
                <Link to="/signup" className={`mt-2 inline-flex items-center justify-center rounded-md py-2.5 font-headline text-label-lg ${p.highlighted ? "bg-accent text-on-accent" : "bg-primary text-on-primary"}`}>
                  {t.landing.ctaStartFree}
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="flex flex-col gap-gutter-lg">
          <h2 className="font-headline text-headline-lg text-on-surface">{t.landing.faqHeading}</h2>
          <div className="flex flex-col gap-2">
            {faq.map((f) => (
              <details key={f.q} className="rounded-lg bg-surface-container-lowest border border-outline-variant p-4">
                <summary className="font-headline text-title-lg text-on-surface cursor-pointer">{f.q}</summary>
                <p className="font-body text-body-md text-on-surface-variant mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-outline-variant bg-surface-container-low">
        <div className="max-w-6xl mx-auto px-gutter-xl py-6 flex items-center justify-between">
          <span className="font-headline text-title-md text-on-surface">{brand}</span>
          <p className="font-body text-label-sm text-on-surface-variant">{t.landing.footerRights} © 2026 {brand}</p>
        </div>
      </footer>
    </div>
  );
}
