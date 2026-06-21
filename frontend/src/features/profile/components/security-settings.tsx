// security-settings.tsx
"use client";
import { useTranslations } from "next-intl";
import { Shield, Key, Smartphone, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/lib/queries/auth";

export function SecuritySettings() {
  const t = useTranslations("profile.security");
  const logoutMutation = useLogout();

  // NOTE: the backend currently tracks a single refreshToken per user
  // (see modules/auth — User.refreshToken is one field, not a list of
  // sessions), so "log out everywhere" and "log out here" both just call
  // POST /auth/logout, which clears that one token. This button is wired
  // separately from the sidebar's logout (rather than sharing one handler)
  // so that if multi-device session tracking is added later, only this
  // handler needs to change to target a "logout all" endpoint instead.
  const handleLogoutAllDevices = () => {
    logoutMutation.mutate();
  };

  return (
    <section
      className="rounded-xl border border-border bg-card p-6"
      aria-labelledby="security-heading"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
          <Shield className="w-4 h-4 text-red-600" aria-hidden="true" />
        </div>
        <h2 id="security-heading" className="text-base font-semibold text-foreground">
          {t("title")}
        </h2>
      </div>
      <div className="space-y-3">
        <Button variant="outline" className="w-full justify-start gap-2 text-sm h-10">
          <Key className="w-4 h-4" aria-hidden="true" />
          {t("changePhone")}
        </Button>
        <Button variant="outline" className="w-full justify-start gap-2 text-sm h-10">
          <Smartphone className="w-4 h-4" aria-hidden="true" />
          {t("manageDevices")}
        </Button>
        <Button
          variant="outline"
          onClick={handleLogoutAllDevices}
          disabled={logoutMutation.isPending}
          className="w-full justify-start gap-2 text-sm h-10 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-50"
        >
          {logoutMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <LogOut className="w-4 h-4" aria-hidden="true" />
          )}
          {t("logoutAllDevices")}
        </Button>
      </div>
    </section>
  );
}