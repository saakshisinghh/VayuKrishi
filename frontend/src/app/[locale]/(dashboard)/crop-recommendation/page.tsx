import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/dashboard/page-container";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.crop_recommendation" });
  return { title: `${t("title")} — Vayukrishi` };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.crop_recommendation" });
  return (
    <PageContainer>
      <PageHeader title={t("title")} description={t("description")} icon="Sprout" iconColor="#2d6a4f" />
      <EmptyState variant="no_crops" />
    </PageContainer>
  );
}
