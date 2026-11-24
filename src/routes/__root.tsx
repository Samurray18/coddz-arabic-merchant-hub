import { BRAND_NAME } from "@/lib/coddz";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "../integrations/supabase/client";
import { AuthContext, type AuthState } from "../lib/auth-context";
import { LanguageProvider } from "../hooks/use-language";
import { RealtimeProvider } from "@/components/realtime-provider";
import { Toaster } from "@/components/ui/sonner";
import type { User, Session } from "@supabase/supabase-js";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Replace these placeholders with the app's name and description when first building the app.
    // Each content route, / included, must still set its own head(). Never add og:image or
    // twitter:image here: every page without its own would inherit the root's preview image.
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "COD YOU | مدير الدفع عند الاستلام للتجار في الجزائر" },
      { name: "description", content: "COD YOU | مدير الدفع عند الاستلام للتجار في الجزائر" },
      { property: "og:title", content: "COD YOU | مدير الدفع عند الاستلام للتجار في الجزائر" },
      { property: "og:description", content: "COD YOU | مدير الدفع عند الاستلام للتجار في الجزائر" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Tajawal:wght@400;500;700&family=Red+Hat+Mono:wght@400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    storeId: null,
    storeName: null,
    storeWilaya: null,
  });

  const refreshStore = async (userId: string | null) => {
    if (!userId) {
      setAuthState((prev) => ({ ...prev, storeId: null, storeName: null, storeWilaya: null }));
      return;
    }
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user ?? null;
      const { data } = await supabase
        .from("stores")
        .select("id, name, wilaya")
        .eq("owner_id", userId)
        .limit(1)
        .maybeSingle();
      const store = data as { id?: string; name?: string | null; wilaya?: string | null } | null;
      const storeId = store?.id ?? null;
      // Backfill from signup metadata if needed
      if (storeId && user) {
        const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
        const storeName = meta["store_name"] ? String(meta["store_name"]) : null;
        const wilaya = meta["wilaya"] ? String(meta["wilaya"]) : null;
        const carriers = Array.isArray(meta["carriers"]) ? (meta["carriers"] as string[]) : [];
        const currentWilaya = store?.wilaya ?? null;
        const currentName = store?.name ?? null;
        if ((!currentWilaya && wilaya) || (!currentName && storeName)) {
          await supabase
            .from("stores")
            .update({ name: storeName ?? undefined, wilaya: wilaya ?? undefined } as any)
            .eq("id", storeId);
        }
        if (carriers.length) {
          const { data: existing } = await (supabase as any).from("store_delivery_companies").select("company").eq("store_id", storeId);
          const existingSet = new Set((existing ?? []).map((r: any) => r.company));
          const toInsert = carriers.filter((c) => !existingSet.has(c)).map((c) => ({ store_id: storeId, company: c }));
          if (toInsert.length) {
            await (supabase as any).from("store_delivery_companies").insert(toInsert);
          }
        }
      }
      setAuthState((prev) => ({
        ...prev,
        storeId,
        storeName: store?.name ?? null,
        storeWilaya: store?.wilaya ?? null,
      }));
    } catch {
      setAuthState((prev) => ({ ...prev, storeId: null, storeName: null, storeWilaya: null }));
    }
  };

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const session = data.session ?? null;
      setAuthState((prev) => ({
        ...prev,
        user: session?.user ?? null,
        session,
        loading: false,
      }));
      refreshStore(session?.user?.id ?? null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "INITIAL_SESSION" ||
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        setAuthState((prev) => ({
          ...prev,
          user: session?.user ?? null,
          session: session ?? null,
          loading: false,
        }));
        refreshStore(session?.user?.id ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    setAuthState({
      user: null,
      session: null,
      loading: false,
      storeId: null,
      storeName: null,
      storeWilaya: null,
    });
    router.navigate({ to: "/", replace: true });
  };

  const value = {
    ...authState,
    signOut,
    refreshStore: async () => refreshStore(authState.user?.id ?? null),
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthContext.Provider value={value}>
          <RealtimeProvider>
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
            <Toaster position="top-center" richColors />
          </RealtimeProvider>
        </AuthContext.Provider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
