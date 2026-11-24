import { BRAND_NAME } from "@/lib/coddz";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NAV = [
  { to: "/dashboard", icon: "dashboard", key: "dashboard", label: "لوحة التحكم" },
  { to: "/orders", icon: "receipt_long", key: "orders", label: "الطلبات" },
  { to: "/confirmation", icon: "task_alt", key: "confirmation", label: "التأكيد", soon: true },
  { to: "/delivery", icon: "monitoring", key: "delivery", label: "التوصيل", soon: true },
  { to: "/inventory", icon: "inventory_2", key: "inventory", label: "المخزون", soon: true },
  { to: "/analytics", icon: "analytics", key: "analytics", label: "الإحصائيات", soon: true },
  { to: "/team", icon: "group", key: "team", label: "الفريق", soon: true },
  { to: "/integrations", icon: "hub", key: "integrations", label: "الربط", soon: true },
  { to: "/settings", icon: "settings", key: "settings", label: "الإعدادات", soon: true },
] as const;

export function DashboardShell({ children }: { children?: React.ReactNode }) {
  const { t, lang, setLang } = useLanguage();
  const { user, isDemo, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/", replace: true });
  };

  const labelFor = (key: string) => {
    if (key === "dashboard") return t.nav.dashboard;
    if (key === "orders") return t.nav.orders;
    return t.nav.products;
  };

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onClick}
          className="flex items-center gap-3 rounded-md px-3.5 py-2.5 text-on-surface-variant transition-colors duration-150 hover:bg-surface-container-low [&.active]:bg-accent-container [&.active]:text-on-accent-container"
        >
          <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
          <span className="font-body text-body-md">{item.label}
            {"soon" in item && item.soon && (
              <span className="ms-auto rounded-full bg-surface-container-low px-2 py-0.5 font-body text-label-sm text-on-surface-variant">
                قريبًا
              </span>
            )}</span>
        </Link>
      ))}
    </nav>
  );

  const userInitial = (user?.email?.[0] ?? "م").toUpperCase();

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      {/* Desktop sidebar */}
      <aside className="hidden min-h-screen w-60 flex-col justify-between border-l border-border bg-card p-5 md:flex">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-on-primary">
              <span className="material-symbols-outlined text-[22px]">monitoring</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-title-md text-on-surface">{BRAND_NAME}</span>
              <span className="font-body text-label-sm text-on-surface-variant">
                {t.nav.demoMode}
              </span>
            </div>
          </div>
          <NavLinks />
        </div>

        <div className="rounded-lg border border-border bg-surface-container-low p-3 flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-headline text-label-md text-on-primary">
            {userInitial}
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-headline text-label-md text-on-surface">
              {user?.email ?? "زائر"}
            </span>
            <span className="font-body text-label-sm text-on-surface-variant">
              {isDemo ? t.nav.demoMode : t.nav.dashboard}
            </span>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 backdrop-blur md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="material-symbols-outlined">menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={lang === "ar" ? "right" : "left"} className="w-64">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-on-primary">
                  <span className="material-symbols-outlined">monitoring</span>
                </div>
                <span className="font-headline text-title-md">{BRAND_NAME}</span>
              </div>
              <NavLinks onClick={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-headline text-title-md">{BRAND_NAME}</span>
          <div className="ms-auto flex items-center gap-2">
            <Select value={lang} onValueChange={(v) => setLang(v as "ar" | "fr" | "en")}>
              <SelectTrigger className="h-9 w-[110px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <span className="material-symbols-outlined">logout</span>
            </Button>
          </div>
        </header>

        {/* Desktop top bar */}
        <header className="hidden items-center justify-between gap-4 border-b border-border bg-surface px-6 py-4 md:flex">
          <div>
            <h1 className="font-headline text-headline-lg text-on-surface">{BRAND_NAME}</h1>
            <p className="font-body text-body-md text-on-surface-variant">{t.nav.dashboard}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={lang} onValueChange={(v) => setLang(v as "ar" | "fr" | "en")}>
              <SelectTrigger className="h-9 w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <span className="material-symbols-outlined me-2 text-[18px]">logout</span>
              {t.nav.signOut}
            </Button>
          </div>
        </header>

        {isDemo && (
          <div className="border-b border-border bg-warning-container/40 px-4 py-2 text-sm text-on-warning-container">
            {t.nav.demoBanner}{" "}
            <Link to="/auth" className="font-semibold underline">
              {t.nav.saveYourStore}
            </Link>
          </div>
        )}

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}