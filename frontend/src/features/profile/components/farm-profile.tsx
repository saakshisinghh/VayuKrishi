"use client";

import { useTranslations } from "next-intl";
import { Tractor, MapPin, Droplets, Wheat } from "lucide-react";
import { useProfile } from "@/features/profile/hooks/use-profile";

interface FarmInfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function FarmInfoRow({ icon: Icon, label, value }: FarmInfoRowProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

export function FarmProfile() {
  const t = useTranslations("profile.farm");
  const { data: profile } = useProfile();

  const farmInfo = [
    {
      icon: MapPin,
      label: t("location"),
      value: profile?.farm?.location ?? "--",
    },
    {
      icon: Tractor,
      label: t("farmSize"),
      value: profile?.farm?.sizeAcres ? `${profile.farm.sizeAcres} ${t("acres")}` : "--",
    },
    {
      icon: Wheat,
      label: t("soilType"),
      value: profile?.farm?.soilType ?? "--",
    },
    {
      icon: Droplets,
      label: t("waterSource"),
      value: profile?.farm?.waterSource ?? "--",
    },
  ];

  return (
    <section
      className="rounded-xl border border-border bg-card p-6"
      aria-labelledby="farm-profile-heading"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
          <Tractor className="w-4 h-4 text-blue-600" aria-hidden="true" />
        </div>
        <h2 id="farm-profile-heading" className="text-base font-semibold text-foreground">
          {t("title")}
        </h2>
      </div>

      <div>
        {farmInfo.map((info) => (
          <FarmInfoRow key={info.label} {...info} />
        ))}
      </div>

      {profile?.farm?.currentCrops && profile.farm.currentCrops.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-2">{t("currentCrops")}</p>
          <div className="flex flex-wrap gap-2">
            {profile.farm.currentCrops.map((crop) => (
              <span
                key={crop}
                className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium px-2.5 py-1 rounded-full"
              >
                <Wheat className="w-3 h-3" aria-hidden="true" />
                {crop}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
