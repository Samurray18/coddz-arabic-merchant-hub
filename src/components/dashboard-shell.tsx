import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { useRealtime } from "@/components/realtime-provider";
import { BRAND_NAME, BRAND_NAME_AR } from "@/lib/coddz";

const NAV = [
  { to: "/dashboard", icon: "dashboard", labelKey: "home", mobile: true },
  { to: "/orders", icon: "receipt_long", labelKey: "orders", mobile: true },
  { to: "/products", icon: "inventory_2", labelKey: "products", mobile: true },
  { to: "/confirmation", icon: "task_alt", labelKey: "confirmation", soon: true, mobile: true },
  { to: "/delivery", icon: "monitoring", labelKey: "delivery", soon: true },
  { to: "/shipments", icon: "local_shipping", labelKey: "shipments" },
  { to: "/inventory", icon: "inventory_2", labelKey: "inventory", soon: true },
  { to: "/analytics", icon: "analytics", labelKey: "analytics", soon: true },
  { to: "/team", icon: "group", labelKey: "team", soon: true },
  { to: "/integrations", icon: "hub", labelKey: "integrations", soon: true },
  { to: "/settings", icon: "settings", labelKey: "settings", soon: true },
] as const;

type NavItem = (typeof NAV)[number];

export function DashboardShell({ children }: { children?: React.ReactNode }) {
  const { t, lang, setLang } = useLanguage();
  const { user, signOut, storeName, storeWilaya } = useAuth();
  const { status } = useRealtime();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const brand = lang === "ar" ? BRAND_NAME_AR : BRAND_NAME;
  const displayName = storeName || t.nav.yourStore;
  const displayWilaya = storeWilaya || brand;

  const labelFor = (item: NavItem) => t.nav[item.labelKey];

  const liveLabel =
    status === "live" ? t.nav.live : status === "reconnecting" ? t.nav.reconnecting : t.nav.offline;
  const dotClass =
    status === "live" ? "bg-accent" : status === "reconnecting" ? "bg-warning" : "bg-outline";

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    setMenuOpen(false);
    await signOut();
  };

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav aria-label={t.nav.home} className="flex flex-col gap-gutter-xs">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className="flex items-center gap-gutter-md rounded-md px-3.5 py-2.5 text-on-surface-variant transition-colors duration-state-change hover:bg-surface-container-low"
          activeProps={{ className: "bg-accent-container text-on-accent-container font-headline text-label-lg" }}
        >
          <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
          <span className="font-body text-body-md">{labelFor(item)}</span>
          {"soon" in item && item.soon && (
            <span className="ms-auto rounded-full bg-surface-container-low px-2 py-0.5 font-body text-label-sm text-on-surface-variant">
              {t.nav.comingSoon}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );

  const LiveBadge = ({ compact = false }: { compact?: boolean }) => (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-surface-container-low px-2.5 py-1 font-body text-label-sm text-on-surface-variant ${compact ? "hidden sm:inline-flex" : ""}`}
    >
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      {liveLabel}
    </span>
  );

  const LanguageSelect = () => (
    <select
      value={lang}
      onChange={(event) => setLang(event.target.value as "ar" | "fr" | "en")}
      aria-label="Language"
      className="rounded-md border border-outline-variant bg-surface-container-lowest px-2 py-1.5 font-body text-label-md text-on-surface focus:border-primary focus:outline-none"
    >
      <option value="ar">العربية</option>
      <option value="fr">Français</option>
      <option value="en">English</option>
    </select>
  );

  const UserCard = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setUserMenuOpen((open) => !open)}
        className="flex w-full items-center gap-gutter-sm rounded-lg border border-outline-variant bg-surface-container-low p-3 text-start"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-headline text-label-md text-on-primary">
          {(user?.email?.[0] ?? "م").toUpperCase()}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-headline text-label-md text-on-surface">{user?.email ?? t.nav.yourStore}</span>
          <span className="font-body text-label-sm text-on-surface-variant">{brand}</span>
        </span>
        <span className="material-symbols-outlined ms-auto text-[18px] text-on-surface-variant">
          {userMenuOpen ? "expand_less" : "expand_more"}
        </span>
      </button>
      {userMenuOpen && (
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            void handleSignOut();
          }}
          className="absolute bottom-full start-0 mb-2 flex w-full items-center gap-2 rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 font-body text-body-md text-on-surface shadow-md transition-colors hover:bg-surface-container-low"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          {t.nav.signOut}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Desktop sidebar */}
        <aside className="hidden min-h-screen flex-col justify-between border-l border-outline-variant bg-surface-container-lowest p-5 lg:flex">
          <div className="flex flex-col gap-gutter-xl">
            <div className="flex items-center gap-gutter-sm px-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-on-primary">
                <span className="material-symbols-outlined text-[22px]">monitoring</span>
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-headline text-title-md text-on-surface">{displayName}</span>
                <span className="truncate font-body text-label-sm text-on-surface-variant">
                  {brand} • {displayWilaya}
                </span>
              </div>
            </div>
            <NavLinks />
          </div>
          <UserCard />
        </aside>

        <div className="flex min-w-0 flex-col">
          {/* Mobile header */}
          <header className="sticky top-0 z-30 flex items-center justify-between gap-gutter-md border-b border-outline-variant bg-surface px-page-margin py-3 lg:hidden">
            <div className="flex items-center gap-gutter-sm">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">menu</span>
              </button>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-headline text-title-md text-on-surface">{displayName}</span>
                <span className="truncate font-body text-label-sm text-on-surface-variant">
                  {brand} • {displayWilaya}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-gutter-sm">
              <LiveBadge compact />
              <button
                type="button"
                onClick={() => void handleSignOut()}
                aria-label={t.nav.signOut}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          </header>

          {/* Desktop header */}
          <header className="sticky top-0 z-30 hidden items-center justify-between gap-gutter-md border-b border-outline-variant bg-surface px-6 py-4 lg:flex">
            <div className="min-w-0">
              <h1 className="truncate font-headline text-headline-lg text-on-surface">{displayName}</h1>
              <p className="font-body text-body-md text-on-surface-variant">
                {brand} • {displayWilaya}
              </p>
            </div>
            <div className="flex items-center gap-gutter-md">
              <LiveBadge />
              <LanguageSelect />
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="inline-flex items-center gap-1.5 rounded-md border border-outline-variant bg-surface-container-lowest px-3.5 py-2.5 font-headline text-label-md text-primary transition-colors duration-state-change hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                {t.nav.signOut}
              </button>
            </div>
          </header>

          <main className="flex-1 px-page-margin py-5 pb-24 lg:px-6 lg:py-6 lg:pb-6">{children}</main>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 inset-x-0 z-30 mx-auto grid max-w-md grid-cols-4 gap-1 border-t border-outline-variant bg-surface-container-lowest px-2 py-2 lg:hidden">
        {NAV.filter((item) => "mobile" in item && item.mobile).map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center justify-center gap-1 rounded-md py-1.5 text-on-surface-variant transition-colors duration-state-change hover:bg-surface-container-low"
            activeProps={{ className: "bg-accent-container text-on-accent-container" }}
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            <span className="font-headline text-label-sm">{labelFor(item)}</span>
          </Link>
        ))}
      </nav>

      {/* Mobile navigation drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="close"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/30"
          />
          <div
            className={`absolute inset-y-0 flex w-72 max-w-[85%] flex-col justify-between gap-gutter-xl border-outline-variant bg-surface-container-lowest p-5 shadow-xl ${
              lang === "ar" ? "right-0 border-l" : "left-0 border-r"
            }`}
          >
            <div className="flex flex-col gap-gutter-xl">
              <div className="flex items-center justify-between gap-gutter-sm">
                <div className="flex items-center gap-gutter-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-on-primary">
                    <span className="material-symbols-outlined text-[20px]">monitoring</span>
                  </div>
                  <span className="font-headline text-title-md">{brand}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="close"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              <NavLinks onNavigate={() => setMenuOpen(false)} />
            </div>
            <div className="flex flex-col gap-gutter-md">
              <LanguageSelect />
              <UserCard onNavigate={() => setMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
