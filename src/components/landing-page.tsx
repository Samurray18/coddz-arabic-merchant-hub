import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/use-language";
import { BRAND_NAME, BRAND_NAME_AR } from "@/lib/coddz";
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

const COPY = {
  ar: {
    badge: "نظام إدارة الدفع عند الاستلام للتجار الجزائريين",
    heroTitle: "تحكّم في طلباتك وأرباحك من لوحة واحدة",
    heroSub: "استقبل الطلبات من متجرك، أكّدها مع فريقك، أرسلها لشركة التوصيل، وتتبّع أرباحك الحقيقية بالدينار الجزائري.",
    cta1: "ابدأ مجانًا",
    howItWorks: "كيف يعمل",
    stats: ["تتبع لحظي للطلبات", "حساب تلقائي للأرباح", "58 ولاية في التسعيرة"],
    featuresTitle: "كل ما يحتاجه التاجر لإدارة نشاطه",
    features: [
      { icon: "receipt_long", title: "إدارة الطلبات", desc: "تتبع كل طلب من الإنشاء إلى التحصيل." },
      { icon: "call", title: "مركز الاتصال والتأكيد", desc: "فريقك يؤكد الطلبات بسرعة." },
      { icon: "shield", title: "حماية من الطلبات الوهمية", desc: "فلترة وتقليل المرتجعات." },
      { icon: "local_shipping", title: "الربط مع شركات التوصيل", desc: "أرسل للناقل بنقرة." },
      { icon: "inventory_2", title: "المخزون", desc: "تتبع المخزون والتنبيهات." },
      { icon: "analytics", title: "الأرباح والإحصائيات", desc: "أرباح حقيقية بالدينار." },
      { icon: "api", title: "الربط مع متجرك", desc: "Shopify, WooCommerce, API." },
      { icon: "sms", title: "رسائل SMS وواتساب", desc: "إشعارات تلقائية للزبائن." },
      { icon: "group", title: "الفريق والصلاحيات", desc: "أدوار وصلاحيات متعددة." },
    ],
    stepsTitle: "كيف يعمل",
    steps: ["اربط متجرك أو أضف الطلبات", "أكّد وأرسل لشركة التوصيل", "تابع التحصيل والأرباح"],
    carriersTitle: "تعمل مع شركات التوصيل التي تتعامل معها",
    pricingTitle: "خطط شهرية بالدينار الجزائري",
    faqTitle: "أسئلة شائعة",
    faq: [
      { q: "هل يمكنني استخدام النظام بدون متجر؟", a: "نعم، يمكنك إضافة الطلبات يدويًا." },
      { q: "هل يدعم شركات التوصيل الجزائرية؟", a: "نعم، الربط مع أغلب الناقلين." },
      { q: "هل توجد عمولة على المبيعات؟", a: "لا، فقط اشتراك شهري." },
      { q: "هل يمكن لإضافة فريق؟", a: "نعم، مع صلاحيات متعددة." },
      { q: "هل البيانات آمنة؟", a: "نعم، كل تاجر يرى بياناته فقط." },
    ],
    footer: "جميع الحقوق محفوظة",
  },
  fr: {
    badge: "Système de gestion COD pour marchands algériens",
    heroTitle: "Contrôlez vos commandes et profits depuis un seul tableau",
    heroSub: "Recevez les commandes de votre boutique, confirmez-les avec votre équipe, envoyez-les au livreur et suivez vos vrais profits en dinars algériens.",
    cta1: "Commencer gratuitement",
    howItWorks: "Comment ça marche",
    stats: ["Suivi en temps réel", "Calcul automatique des profits", "58 wilayas tarifées"],
    featuresTitle: "Tout ce dont un marchand a besoin",
    features: [
      { icon: "receipt_long", title: "Gestion des commandes", desc: "Suivi de la création à l'encaissement." },
      { icon: "call", title: "Centre d'appel", desc: "Votre équipe confirme rapidement." },
      { icon: "shield", title: "Protection anti-fraude", desc: "Filtrage des fausses commandes." },
      { icon: "local_shipping", title: "Intégration livreurs", desc: "Envoi en un clic." },
      { icon: "inventory_2", title: "Stock", desc: "Suivi et alertes." },
      { icon: "analytics", title: "Profits et stats", desc: "Vrais profits en DZD." },
      { icon: "api", title: "Intégration boutique", desc: "Shopify, WooCommerce, API." },
      { icon: "sms", title: "SMS et WhatsApp", desc: "Notifications automatiques." },
      { icon: "group", title: "Équipe et rôles", desc: "Accès multiples." },
    ],
    stepsTitle: "Comment ça marche",
    steps: ["Connectez votre boutique ou ajoutez des commandes", "Confirmez et envoyez au livreur", "Suivez l'encaissement et les profits"],
    carriersTitle: "Compatible avec vos livreurs",
    pricingTitle: "Plans mensuels en DZD",
    faqTitle: "FAQ",
    faq: [
      { q: "Puis-je utiliser sans boutique ?", a: "Oui, ajout manuel des commandes." },
      { q: "Supporte les livreurs algériens ?", a: "Oui, la plupart." },
      { q: "Commission sur ventes ?", a: "Non, abonnement mensuel." },
      { q: "Ajouter une équipe ?", a: "Oui, avec rôles." },
      { q: "Données sécurisées ?", a: "Oui, isolation par marchand." },
    ],
    footer: "Tous droits réservés",
  },
  en: {
    badge: "COD management system for Algerian merchants",
    heroTitle: "Control your orders and profits from one dashboard",
    heroSub: "Receive orders from your store, confirm them with your team, send to a carrier, and track real profits in Algerian dinars.",
    cta1: "Start free",
    howItWorks: "How it works",
    stats: ["Real-time order tracking", "Automatic profit calculation", "58 wilayas priced"],
    featuresTitle: "Everything a merchant needs",
    features: [
      { icon: "receipt_long", title: "Order management", desc: "Track from creation to collection." },
      { icon: "call", title: "Call center", desc: "Team confirms quickly." },
      { icon: "shield", title: "Fake order protection", desc: "Filter and reduce returns." },
      { icon: "local_shipping", title: "Carrier integration", desc: "Send with one click." },
      { icon: "inventory_2", title: "Inventory", desc: "Stock and alerts." },
      { icon: "analytics", title: "Profits and analytics", desc: "Real profits in DZD." },
      { icon: "api", title: "Store integration", desc: "Shopify, WooCommerce, API." },
      { icon: "sms", title: "SMS and WhatsApp", desc: "Automatic notifications." },
      { icon: "group", title: "Team and roles", desc: "Multiple permissions." },
    ],
    stepsTitle: "How it works",
    steps: ["Connect your store or add orders", "Confirm and send to carrier", "Track collection and profits"],
    carriersTitle: "Works with your carriers",
    pricingTitle: "Monthly plans in DZD",
    faqTitle: "FAQ",
    faq: [
      { q: "Can I use without a store?", a: "Yes, add orders manually." },
      { q: "Supports Algerian carriers?", a: "Yes, most of them." },
      { q: "Commission on sales?", a: "No, monthly subscription." },
      { q: "Add a team?", a: "Yes, with roles." },
      { q: "Data secure?", a: "Yes, per-merchant isolation." },
    ],
    footer: "All rights reserved",
  },
};

export function LandingPage() {
  const { lang, setLang, t } = useLanguage();
  const c = COPY[lang];
  const brand = lang === "ar" ? BRAND_NAME_AR : BRAND_NAME;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-body">
      <header className="sticky top-0 z-30 bg-surface border-b border-outline-variant">
        <div className="max-w-6xl mx-auto px-gutter-xl py-4 flex items-center justify-between gap-gutter-lg">
          <div className="flex items-center gap-gutter-sm">
            <div className="w-10 h-10 rounded-md bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">monitoring</span>
            </div>
            <span className="font-display text-title-lg text-on-surface" style={{ fontWeight: 800 }}>{brand}</span>
          </div>
          <nav className="hidden md:flex items-center gap-gutter-xl">
            <a href="#features" className="font-body text-body-md text-on-surface-variant hover:text-primary transition-colors">{c.featuresTitle}</a>
            <a href="#pricing" className="font-body text-body-md text-on-surface-variant hover:text-primary transition-colors">{c.pricingTitle}</a>
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
              {c.cta1}
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
              <span className="font-body text-label-md">{c.badge}</span>
            </div>
            <h1 className="font-display text-display-lg text-on-surface text-balance">{c.heroTitle}</h1>
            <p className="font-body text-body-lg text-on-surface-variant text-pretty max-w-prose">{c.heroSub}</p>
            <div className="flex items-center gap-gutter-md pt-2">
              <Link to="/signup" className="inline-flex items-center justify-center rounded-md bg-primary text-on-primary px-6 py-3.5 font-headline text-label-lg transition-colors hover:bg-success">
                {c.cta1}
              </Link>
              <a href="#how" className="inline-flex items-center justify-center rounded-md bg-surface-container-lowest text-primary border border-outline-variant px-6 py-3.5 font-headline text-label-lg transition-colors hover:bg-surface-container-low">
                {c.howItWorks}
              </a>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-outline-variant bg-surface-container-lowest shadow-sm">
            <img src="/images/hero-box-phone.png" alt={c.heroTitle} className="w-full h-80 object-cover" />
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg">
          {c.stats.map((s) => (
            <div key={s} className="rounded-lg bg-surface-container-lowest border border-outline-variant p-6 text-center">
              <span className="font-headline text-headline-md text-primary">{s}</span>
            </div>
          ))}
        </section>

        {/* Features */}
        <section id="features" className="flex flex-col gap-gutter-lg">
          <h2 className="font-headline text-headline-lg text-on-surface">{c.featuresTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg">
            {c.features.map((f) => (
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
          <h2 className="font-headline text-headline-lg text-on-surface">{c.stepsTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg">
            {c.steps.map((s, i) => (
              <div key={s} className="rounded-lg bg-surface-container-lowest border border-outline-variant p-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline text-label-lg shrink-0">{i + 1}</span>
                <span className="font-body text-body-md text-on-surface">{s}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Carriers */}
        <section className="flex flex-col gap-gutter-lg">
          <h2 className="font-headline text-headline-lg text-on-surface">{c.carriersTitle}</h2>
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
          <h2 className="font-headline text-headline-lg text-on-surface">{c.pricingTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg">
            {PLANS.map((p) => (
              <article key={p.name} className={`rounded-xl border p-6 flex flex-col gap-3 ${p.highlighted ? "bg-primary text-on-primary border-primary" : "bg-surface-container-lowest border-outline-variant"}`}>
                <h3 className="font-headline text-title-lg">{p.name}</h3>
                <div className="font-headline text-headline-md tabular-nums">{p.priceDzd} دج / شهر</div>
                <div className="font-body text-body-md">{p.orderLimit}</div>
                <ul className="flex flex-col gap-1">
                  {p.features.map((f) => (
                    <li key={f} className="font-body text-body-md">• {f}</li>
                  ))}
                </ul>
                <Link to="/signup" className={`mt-2 inline-flex items-center justify-center rounded-md py-2.5 font-headline text-label-lg ${p.highlighted ? "bg-accent text-on-accent" : "bg-primary text-on-primary"}`}>
                  {c.cta1}
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="flex flex-col gap-gutter-lg">
          <h2 className="font-headline text-headline-lg text-on-surface">{c.faqTitle}</h2>
          <div className="flex flex-col gap-2">
            {c.faq.map((f) => (
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
          <p className="font-body text-label-sm text-on-surface-variant">{c.footer} © 2026 {brand}</p>
        </div>
      </footer>
    </div>
  );
}