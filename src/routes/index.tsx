import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/use-language";
import { HERO_ILLUSTRATION_URL, BRAND_NAME } from "@/lib/coddz";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "CODDZ — Merchant Hub" },
      { name: "description", content: "COD orders, products and customers for Algerian merchants." },
    ],
  }),
});

function Index() {
  const { t, lang, setLang } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              C
            </div>
            <span className="text-lg font-bold">{BRAND_NAME}</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#features" className="text-muted-foreground hover:text-foreground">{t.nav.features}</a>
            <a href="#how" className="text-muted-foreground hover:text-foreground">{t.nav.howItWorks}</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground">{t.nav.pricing}</a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground">{t.nav.faq}</a>
          </nav>
          <div className="flex items-center gap-2">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as "ar" | "fr" | "en")}
              className="rounded-md border bg-background px-2 py-1 text-sm"
            >
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
            <Link to="/auth">
              <Button variant="ghost" size="sm">{t.nav.signIn}</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm">{t.nav.startFree}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {t.hero.eyebrow}
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">{t.hero.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{t.hero.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/auth">
                <Button size="lg">{t.hero.ctaPrimary}</Button>
              </Link>
              <a href="#how">
                <Button size="lg" variant="outline">{t.hero.ctaSecondary}</Button>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm">
              <div>
                <div className="text-2xl font-bold text-primary">+1,200</div>
                <div className="text-muted-foreground">{t.hero.statOrders}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">58</div>
                <div className="text-muted-foreground">{t.hero.statWilayas}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">7</div>
                <div className="text-muted-foreground">{t.hero.statCarriers}</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <img src={HERO_ILLUSTRATION_URL} alt="CODDZ" className="max-w-md w-full rounded-2xl shadow-card" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">{t.landing.featuresTitle}</h2>
          <p className="mt-2 text-center text-muted-foreground">{t.landing.featuresSub}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { title: "COD Orders", desc: "Track every cash-on-delivery order from new to delivered." },
              { title: "Stock & Margins", desc: "Manage products, variants and profit margins in DA." },
              { title: "Carriers", desc: "Yalidine, ZR Express, Noest and more Algerian carriers." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border bg-card p-6 shadow-card">
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">{t.landing.stepsTitle}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {["Create your store", "Add products", "Take COD orders"].map((s, i) => (
              <div key={s} className="rounded-xl border bg-card p-6 text-center shadow-card">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {i + 1}
                </div>
                <h3 className="font-semibold">{s}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carriers */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">{t.landing.carriersTitle}</h2>
          <p className="mt-2 text-center text-muted-foreground">{t.landing.carriersSub}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {["Yalidine", "ZR Express", "Noest", "Maystro Delivery", "Procolis", "Ecotrack", "Guepex"].map((c) => (
              <span key={c} className="rounded-full border bg-card px-4 py-2 text-sm">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">{t.landing.pricingTitle}</h2>
          <p className="mt-2 text-center text-muted-foreground">{t.landing.pricingSub}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { name: "Starter", price: "0 DA", popular: false },
              { name: "Pro", price: "2,500 DA/mo", popular: true },
              { name: "Business", price: "6,000 DA/mo", popular: false },
            ].map((p) => (
              <div key={p.name} className={`rounded-xl border bg-card p-6 shadow-card ${p.popular ? "ring-2 ring-primary" : ""}`}>
                {p.popular && <div className="mb-2 text-xs font-semibold text-primary">{t.landing.popular}</div>}
                <h3 className="text-xl font-bold">{p.name}</h3>
                <div className="mt-2 text-2xl font-bold">{p.price}</div>
                <Button className="mt-4 w-full" variant={p.popular ? "default" : "outline"}>
                  {t.landing.choosePlan}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-3xl font-bold">{t.landing.faqTitle}</h2>
          <div className="mt-8 space-y-4">
            {[
              { q: "Is CODDZ free to start?", a: "Yes, the Starter plan is free forever." },
              { q: "Which carriers are supported?", a: "Yalidine, ZR Express, Noest, Maystro, Procolis, Ecotrack, Guepex." },
              { q: "Can I use it in demo mode?", a: "Yes, browse sample data without an account." },
            ].map((f) => (
              <div key={f.q} className="rounded-lg border bg-card p-4">
                <div className="font-semibold">{f.q}</div>
                <div className="mt-1 text-sm text-muted-foreground">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          {t.landing.footerNote}
        </div>
      </footer>
    </div>
  );
}