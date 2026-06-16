"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Pill, Leaf, AlertTriangle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TreatmentPlan, Medicine } from "../types/treatment.types";

interface TreatmentPlanCardProps {
  treatment: TreatmentPlan;
}

const urgencyConfig = {
  immediate: { label: "treatment.urgency.immediate", class: "bg-red-100 text-red-700 border-red-200" },
  within_24h: { label: "treatment.urgency.within24h", class: "bg-orange-100 text-orange-700 border-orange-200" },
  within_week: { label: "treatment.urgency.withinWeek", class: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  monitor: { label: "treatment.urgency.monitor", class: "bg-blue-100 text-blue-700 border-blue-200" },
};

function MedicineItem({ medicine, organic }: { medicine: Medicine; organic?: boolean }) {
  const t = useTranslations("diseaseDetection");
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border p-4 ${organic ? "border-green-200 bg-green-50/60 dark:border-green-900 dark:bg-green-950/20" : "border-border bg-muted/20"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          {organic ? (
            <Leaf className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
          ) : (
            <Pill className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
          )}
          <div>
            <p className="font-semibold text-foreground">{medicine.name}</p>
            <p className="text-xs text-muted-foreground">{medicine.genericName}</p>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 flex-shrink-0"
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? t("treatment.collapse") : t("treatment.expand")}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="outline" className="text-xs">
          💊 {medicine.dosage}
        </Badge>
        <Badge variant="outline" className="text-xs">
          🔁 {medicine.frequency}
        </Badge>
        <Badge variant="outline" className="text-xs">
          ⏱️ {medicine.duration}
        </Badge>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 space-y-2 border-t pt-3"
        >
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{t("treatment.method")}:</span>{" "}
            {medicine.applicationMethod.replace("_", " ")}
          </p>
          {medicine.dilution && (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{t("treatment.dilution")}:</span>{" "}
              {medicine.dilution}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{t("treatment.safetyInterval")}:</span>{" "}
            {medicine.safetyInterval}
          </p>
          {medicine.availableAt.length > 0 && (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{t("treatment.availableAt")}:</span>{" "}
              {medicine.availableAt.join(", ")}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}

export function TreatmentPlanCard({ treatment }: TreatmentPlanCardProps) {
  const t = useTranslations("diseaseDetection");
  const [showOrganic, setShowOrganic] = useState(false);
  const urg = urgencyConfig[treatment.urgency];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">{t("treatment.title")}</CardTitle>
          <Badge className={`border text-xs ${urg.class}`}>
            <Clock className="mr-1 h-3 w-3" />
            {t(urg.label)}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>💰 ₹{treatment.estimatedCost.min}–₹{treatment.estimatedCost.max}</span>
          <span>·</span>
          <span>✅ {treatment.effectiveness}% {t("treatment.effectiveness")}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pb-5">
        {/* Tab switcher */}
        <div className="flex rounded-lg border p-1">
          <Button
            size="sm"
            variant={showOrganic ? "ghost" : "default"}
            className="flex-1 text-xs"
            onClick={() => setShowOrganic(false)}
          >
            <Pill className="mr-1.5 h-3.5 w-3.5" />
            {t("treatment.chemical")}
          </Button>
          <Button
            size="sm"
            variant={showOrganic ? "default" : "ghost"}
            className="flex-1 text-xs"
            onClick={() => setShowOrganic(true)}
          >
            <Leaf className="mr-1.5 h-3.5 w-3.5" />
            {t("treatment.organic")}
          </Button>
        </div>

        {/* Medicine list */}
        <div className="flex flex-col gap-3">
          {(showOrganic ? treatment.organicAlternatives : treatment.medicines).map(
            (med) => (
              <MedicineItem key={med.id} medicine={med} organic={showOrganic} />
            )
          )}
        </div>

        {/* Safety notes */}
        {treatment.safetyNotes.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-950/20">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                {t("treatment.safetyNotes")}
              </p>
            </div>
            <ul className="space-y-1">
              {treatment.safetyNotes.map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
