import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/dashboard/page-container";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.planner" });
  return { title: `${t("title")} — Vayukrishi` };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.planner" });
  return (
    <PageContainer>
      <PageHeader title={t("title")} description={t("description")} icon="CalendarDays" iconColor="#ef4444" />
      <EmptyState title="No plans yet" description="Create your first crop plan for the upcoming season." />
    </PageContainer>
  );
}
