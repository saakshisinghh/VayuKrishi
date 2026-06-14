import { z } from 'zod';

// ─── Step 1: Location ─────────────────────────────────────────────────────────
export const locationSchema = z.object({
  state: z.string().min(2, 'validation.state_required'),
  district: z.string().min(2, 'validation.district_required'),
  village: z.string().min(2, 'validation.village_required'),
  pincode: z
    .string()
    .regex(/^\d{6}$/, 'validation.pincode_invalid'),
});

// ─── Step 2: Land Details ─────────────────────────────────────────────────────
export const landDetailsSchema = z.object({
  size: z
    .number({ error: 'validation.size_required' })
    .positive('validation.size_positive')
    .max(10000, 'validation.size_max'),
  unit: z.enum(['acres', 'hectares', 'bigha', 'guntha'], 'validation.unit_required'),
  ownershipType: z.enum(['owned', 'leased', 'shared'], 'validation.ownership_required'),
});

// ─── Step 3: Soil Information ─────────────────────────────────────────────────
export const soilInformationSchema = z.object({
  soilType: z.enum(['black', 'red', 'alluvial', 'sandy', 'loamy', 'clay', 'laterite'], 'validation.soil_type_required'),
  phValue: z
    .number({ error: 'validation.ph_required' })
    .min(0, 'validation.ph_min')
    .max(14, 'validation.ph_max'),
  organicMatter: z.enum(['low', 'medium', 'high'], 'validation.organic_matter_required'),
});

// ─── Step 4: Water Availability ───────────────────────────────────────────────
export const waterInfoSchema = z.object({
  irrigationSource: z.enum(['canal', 'borewell', 'rainwater', 'river', 'tank', 'drip'], 'validation.irrigation_required'),
  waterAvailability: z.enum(['abundant', 'moderate', 'scarce'], 'validation.water_availability_required'),
  rainDependency: z.boolean(),
});

// ─── Step 5: Season ───────────────────────────────────────────────────────────
export const seasonPreferenceSchema = z
  .object({
    kharif: z.boolean(),
    rabi: z.boolean(),
    zaid: z.boolean(),
  })
  .refine((data) => data.kharif || data.rabi || data.zaid, {
    message: 'validation.season_required',
  });

// ─── Step 6: Goals ────────────────────────────────────────────────────────────
export const farmingGoalsSchema = z
  .object({
    maximumProfit: z.boolean(),
    lowRisk: z.boolean(),
    waterSaving: z.boolean(),
    organicFarming: z.boolean(),
  })
  .refine(
    (data) =>
      data.maximumProfit || data.lowRisk || data.waterSaving || data.organicFarming,
    { message: 'validation.goals_required' }
  );

// ─── Full Farm Profile ────────────────────────────────────────────────────────
export const farmProfileSchema = z.object({
  location: locationSchema,
  landDetails: landDetailsSchema,
  soilInformation: soilInformationSchema,
  waterInfo: waterInfoSchema,
  seasonPreference: seasonPreferenceSchema,
  goals: farmingGoalsSchema,
});

export type LocationFormValues = z.infer<typeof locationSchema>;
export type LandDetailsFormValues = z.infer<typeof landDetailsSchema>;
export type SoilInformationFormValues = z.infer<typeof soilInformationSchema>;
export type WaterInfoFormValues = z.infer<typeof waterInfoSchema>;
export type SeasonPreferenceFormValues = z.infer<typeof seasonPreferenceSchema>;
export type FarmingGoalsFormValues = z.infer<typeof farmingGoalsSchema>;
export type FarmProfileFormValues = z.infer<typeof farmProfileSchema>;

// ─── Step Schema Map ──────────────────────────────────────────────────────────
export const stepSchemas = {
  1: locationSchema,
  2: landDetailsSchema,
  3: soilInformationSchema,
  4: waterInfoSchema,
  5: seasonPreferenceSchema,
  6: farmingGoalsSchema,
} as const;