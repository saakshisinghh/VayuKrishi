import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/dashboard/page-container";
import { PageHeader } from "@/components/dashboard/page-header";


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.settings" });
  return { title: `${t("title")} — Vayukrishi` };
}

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.settings" });
  return (
    <PageContainer maxWidth="md">
      <PageHeader
        title={t("title")}
        description={t("description")}
        icon="Settings"
        iconColor="#64748b"
      />
      <div
        style={{
          background: "var(--color-card-bg)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: 16,
          padding: "48px 24px",
          textAlign: "center",
          color: "var(--color-text-muted)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
        }}
      >
        Settings panel — coming in Phase 3.
      </div>
    </PageContainer>
  );
}
