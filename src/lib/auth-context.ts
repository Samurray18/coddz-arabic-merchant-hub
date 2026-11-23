import { createContext, useContext } from "react";
import type { User, Session } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  storeId: string | null;
  isDemo: boolean;
}

export interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>;
  refreshStore: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthContext.Provider");
  return ctx;
}