"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { UserRole } from "@/types/lms";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | "guest";
  isAdmin: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: "guest",
  isAdmin: false,
  isLoading: true,
  isConfigured: false,
  signInWithGoogle: async () => ({ error: null }),
  signOut: async () => {},
  refreshRole: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | "guest">("guest");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  const supabase = createClient();

  const fetchRole = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setRole("guest");
      setIsAdmin(false);
      return;
    }

    // Immediate optimistic check for designated teacher account
    const isTeacherEmail =
      currentUser.email?.toLowerCase() === "parveshdhiman1900@gmail.com";
    if (isTeacherEmail) {
      setRole("admin");
      setIsAdmin(true);
    }

    try {
      const res = await fetch("/api/auth/role");
      if (res.ok) {
        const data = await res.json();
        setRole(data.role || "student");
        setIsAdmin(Boolean(data.isAdmin || isTeacherEmail));
      }
    } catch (err) {
      console.warn("Failed to fetch verified role from server:", err);
      if (isTeacherEmail) {
        setRole("admin");
        setIsAdmin(true);
      } else {
        setRole("student");
        setIsAdmin(false);
      }
    }
  }, []);

  useEffect(() => {
    const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const hasKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    setIsConfigured(hasUrl && hasKey);

    if (!hasUrl || !hasKey) {
      setIsLoading(false);
      return;
    }

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      fetchRole(session?.user ?? null).finally(() => {
        setIsLoading(false);
      });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      fetchRole(session?.user ?? null).finally(() => {
        setIsLoading(false);
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchRole]);

  const signInWithGoogle = async (redirectTo?: string) => {
    if (!isConfigured) {
      return {
        error: new Error(
          "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) are not configured in .env.local yet."
        ),
      };
    }

    const targetUrl =
      redirectTo ||
      (typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : "/");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: targetUrl,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setRole("guest");
    setIsAdmin(false);
  };

  const refreshRole = async () => {
    await fetchRole(user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        isAdmin,
        isLoading,
        isConfigured,
        signInWithGoogle,
        signOut,
        refreshRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
