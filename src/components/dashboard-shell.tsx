import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Globe, Menu } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV = [
  { to: "/dashboard", labelKey: "dashboard" as const, icon: LayoutDashboard },
  { to: "/orders", labelKey: "orders" as const, icon: ShoppingCart },
  { to: "/products", labelKey: "products" as const, icon: Package },
];

export function DashboardShell({ children }: { children?: React.ReactNode }) {
  const { t, lang, setLang } = useLanguage();
  const { user, isDemo, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/", replace: true });
  };

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        const label =
          item.labelKey === "dashboard"
            ? t.nav.dashboard
            : item.labelKey === "orders"
              ? t.nav.orders
              : t.nav.products;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClick}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground [&.active]:bg-accent [&.active]:text-accent-foreground"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-e bg-sidebar p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            C
          </div>
          <span className="text-lg font-bold">{t.nav.dashboard === "لوحة التحكم" ? "CODDZ" : "CODDZ"}</span>
        </div>
        <NavLinks />
        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-2 rounded-lg border p-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as "ar" | "fr" | "en")}
              className="flex-1 bg-transparent text-sm outline-none"
            >
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          {user && (
            <div className="text-xs text-muted-foreground truncate px-2">{user.email}</div>
          )}
          <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
            <LogOut className="me-2 h-4 w-4" />
            {t.nav.signOut}
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={lang === "ar" ? "right" : "left"} className="w-64">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  C
                </div>
                <span className="text-lg font-bold">CODDZ</span>
              </div>
              <NavLinks onClick={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-bold">CODDZ</span>
          <div className="ms-auto">
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {isDemo && (
          <div className="border-b bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            {t.nav.demoBanner}{" "}
            <Link to="/auth" className="font-semibold underline">
              {t.nav.saveYourStore}
            </Link>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}