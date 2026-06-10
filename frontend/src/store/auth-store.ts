// ─────────────────────────────────────────────────────────────────────────────
// src/store/auth-store.ts
// Zustand auth store — Access Token in memory, NO localStorage
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AuthStore, Language, User } from "@/types/auth";
import { refreshTokenApi } from "@/lib/api/auth";

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      // ─── State ──────────────────────────────────────────────────────────────
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,
      status: "idle",
      role: null,
      language: "en",

      // ─── Actions ─────────────────────────────────────────────────────────────

      login: (user: User, accessToken: string) => {
        set(
          {
            user,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
            status: "authenticated",
            role: user.role,
            language: user.language,
          },
          false,
          "auth/login"
        );
      },

      logout: () => {
        set(
          {
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            status: "unauthenticated",
            role: null,
          },
          false,
          "auth/logout"
        );
      },

      setUser: (user: User) => {
        set({ user, role: user.role, language: user.language }, false, "auth/setUser");
      },

      setAccessToken: (token: string) => {
        set({ accessToken: token }, false, "auth/setAccessToken");
      },

      setLanguage: (language: Language) => {
        set({ language }, false, "auth/setLanguage");
      },

      setLoading: (loading: boolean) => {
        set(
          { isLoading: loading, status: loading ? "loading" : get().status },
          false,
          "auth/setLoading"
        );
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated }, false, "auth/setHydrated");
      },

      refreshSession: async () => {
        try {
          set({ isLoading: true }, false, "auth/refreshSession:start");
          const { accessToken, user } = await refreshTokenApi();
          set(
            {
              accessToken,
              user,
              isAuthenticated: true,
              isLoading: false,
              status: "authenticated",
              role: user.role,
              language: user.language,
              isHydrated: true,
            },
            false,
            "auth/refreshSession:success"
          );
        } catch {
          set(
            {
              user: null,
              accessToken: null,
              isAuthenticated: false,
              isLoading: false,
              status: "unauthenticated",
              role: null,
              isHydrated: true,
            },
            false,
            "auth/refreshSession:failure"
          );
        }
      },
    }),
    { name: "VayukrishiAuth" }
  )
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectUser = (s: AuthStore) => s.user;
export const selectIsAuthenticated = (s: AuthStore) => s.isAuthenticated;
export const selectRole = (s: AuthStore) => s.role;
export const selectAccessToken = (s: AuthStore) => s.accessToken;
export const selectIsHydrated = (s: AuthStore) => s.isHydrated;
export const selectLanguage = (s: AuthStore) => s.language;
