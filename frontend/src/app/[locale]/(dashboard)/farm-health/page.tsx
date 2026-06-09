import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/dashboard/page-container";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.farm_health" });
  return { title: `${t("title")} — Vayukrishi` };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.farm_health" });
  return (
    <PageContainer>
      <PageHeader title={t("title")} description={t("description")} icon="HeartPulse" iconColor="#22c55e" />
      <EmptyState title="Farm health" description="Connect your farm profile to view health data." />
    </PageContainer>
  );
}
