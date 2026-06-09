"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { PageContainer } from "@/components/dashboard/page-container";
import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ActionCard } from "@/components/dashboard/action-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import {
   Sprout, ScanLine, TrendingUp,
  HeartPulse, CalendarDays, Landmark, Mic2,
} from "lucide-react";

export default function OverviewPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t    = useTranslations("pages.overview");
  const tNav = useTranslations("nav.items");

  return (
    <PageContainer>
      <PageHeader
        title={t("title")}
        description={t("description")}
        icon="LayoutDashboard"
        badge="Kharif 2025"
      />
      <SectionHeader title={t("sections.farm_at_a_glance")} />
      <DashboardGrid cols={4}>
        <MetricCard title={t("metrics.total_area")}   value="12.4" unit="acres" change={0}   icon={Sprout}     color="#2d6a4f" />
        <MetricCard title={t("metrics.active_crops")} value="3"                 change={12}  changeLabel="vs last season" icon={Sprout} color="#2d6a4f" />
        <MetricCard title={t("metrics.health_score")} value="87"  unit="%"      change={5}   icon={HeartPulse} color="#22c55e" />
        <MetricCard title={t("metrics.alerts")}       value="2"                 change={-30} icon={ScanLine}   color="#f59e0b" />
      </DashboardGrid>
      <div style={{ marginTop: 32 }}>
        <SectionHeader title={t("sections.quick_actions")} />
        <DashboardGrid cols={3}>
          <ActionCard title={tNav("crop_recommendation")} description={t("action_descriptions.crop")}      href={`/${locale}/crop-recommendation`} icon={Sprout}       color="#2d6a4f" />
          <ActionCard title={tNav("disease_detection")}   description={t("action_descriptions.disease")}   href={`/${locale}/disease-detection`}   icon={ScanLine}     color="#e67e22" badge="AI" />
          <ActionCard title={tNav("assistant")}           description={t("action_descriptions.assistant")} href={`/${locale}/assistant`}           icon={Mic2}         color="#8b5cf6" badge="Voice" />
          <ActionCard title={tNav("market")}              description={t("action_descriptions.market")}    href={`/${locale}/market`}              icon={TrendingUp}   color="#3b82f6" />
          <ActionCard title={tNav("planner")}             description={t("action_descriptions.planner")}   href={`/${locale}/planner`}             icon={CalendarDays} color="#ef4444" />
          <ActionCard title={tNav("schemes")}             description={t("action_descriptions.schemes")}   href={`/${locale}/schemes`}             icon={Landmark}     color="#f59e0b" />
        </DashboardGrid>
      </div>
    </PageContainer>
  );
}