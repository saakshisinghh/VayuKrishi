import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/dashboard/page-container";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.assistant" });
  return { title: `${t("title")} — Vayukrishi` };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.assistant" });
  return (
    <PageContainer>
      <PageHeader title={t("title")} description={t("description")} icon="Mic2" iconColor="#8b5cf6" />
      <EmptyState title="Coming soon" description="Voice assistant launches in Phase 3." />
    </PageContainer>
  );
}
