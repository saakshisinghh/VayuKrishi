"use client";
import Image from 'next/image';
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Camera } from "lucide-react";
import { useProfile } from "@/features/profile/hooks/use-profile";
import { useUpdateProfile } from "@/features/profile/hooks/use-update-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const personalSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  email: z.string().email().optional().or(z.literal("")),
  village: z.string().min(2).max(100),
  district: z.string().min(2).max(100),
  state: z.string().min(2).max(60),
});

type PersonalFormValues = z.infer<typeof personalSchema>;

export function PersonalDetails() {
  const t = useTranslations("profile.personal");
  const { data: profile } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      name: profile?.name ?? "",
      phone: profile?.phone ?? "",
      email: profile?.email ?? "",
      village: profile?.village ?? "",
      district: profile?.district ?? "",
      state: profile?.state ?? "",
    },
  });

  const onSubmit = (data: PersonalFormValues) => {
    updateProfile(data);
  };

  return (
    <section
      className="rounded-xl border border-border bg-card p-6"
      aria-labelledby="personal-details-heading"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
          <User className="w-4 h-4 text-emerald-600" aria-hidden="true" />
        </div>
        <h2 id="personal-details-heading" className="text-base font-semibold text-foreground">
          {t("title")}
        </h2>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div
            className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden"
            aria-label={t("avatar")}
          >
            {profile?.avatarUrl ? (
              <Image src={profile.avatarUrl} alt={profile.name} fill className="object-cover" />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
            )}
          </div>
          <button
            type="button"
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t("changeAvatar")}
          >
            <Camera className="w-3 h-3 text-white" aria-hidden="true" />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{profile?.name ?? "--"}</p>
          <p className="text-xs text-muted-foreground">{profile?.phone ?? "--"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              { field: "name", label: t("name"), type: "text", required: true },
              { field: "phone", label: t("phone"), type: "tel", required: true },
              { field: "email", label: t("email"), type: "email", required: false },
              { field: "village", label: t("village"), type: "text", required: true },
              { field: "district", label: t("district"), type: "text", required: true },
              { field: "state", label: t("state"), type: "text", required: true },
            ] as const
          ).map(({ field, label, type, required }) => (
            <div key={field}>
              <label
                htmlFor={`personal-${field}`}
                className="block text-xs font-medium text-muted-foreground mb-1.5"
              >
                {label}
                {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
              </label>
              <Input
                id={`personal-${field}`}
                type={type}
                aria-required={required}
                aria-invalid={!!errors[field]}
                aria-describedby={errors[field] ? `${field}-error` : undefined}
                {...register(field)}
              />
              {errors[field] && (
                <p id={`${field}-error`} className="text-xs text-red-500 mt-1" role="alert">
                  {errors[field]?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            type="submit"
            disabled={!isDirty || isPending}
            className="min-w-24"
            aria-busy={isPending}
          >
            {isPending ? t("saving") : t("save")}
          </Button>
        </div>
      </form>
    </section>
  );
}
