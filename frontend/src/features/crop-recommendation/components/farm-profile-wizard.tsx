/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  MapPin,
  Layers,
  FlaskConical,
  Droplets,
  Calendar,
  Target,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { WizardStep, WizardStepHeader } from './wizard-step';
import {
  locationSchema,
  landDetailsSchema,
  soilInformationSchema,
  waterInfoSchema,
  seasonPreferenceSchema,
  farmingGoalsSchema,
  type LocationFormValues,
  type LandDetailsFormValues,
  type SoilInformationFormValues,
  type WaterInfoFormValues,
  type SeasonPreferenceFormValues,
  type FarmingGoalsFormValues,
} from '../schemas/farm-profile.schema';
import type { FarmProfile } from '../types/crop-recommendation.types';

// ─── INDIAN STATES ────────────────────────────────────────────────────────────
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

// ─── Types ────────────────────────────────────────────────────────────────────
type StepForms =
  | LocationFormValues
  | LandDetailsFormValues
  | SoilInformationFormValues
  | WaterInfoFormValues
  | SeasonPreferenceFormValues
  | FarmingGoalsFormValues;

interface FarmProfileWizardProps {
  onSubmit: (profile: FarmProfile) => void;
  isLoading?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function FarmProfileWizard({ onSubmit, isLoading }: FarmProfileWizardProps) {
  const t = useTranslations('cropRecommendation.wizard');
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [collectedData, setCollectedData] = useState<Partial<FarmProfile>>({});

  const TOTAL_STEPS = 6;

  const stepConfig = [
    {
      label: t('steps.location'),
      icon: <MapPin className="h-5 w-5" aria-hidden />,
      schema: locationSchema,
    },
    {
      label: t('steps.land'),
      icon: <Layers className="h-5 w-5" aria-hidden />,
      schema: landDetailsSchema,
    },
    {
      label: t('steps.soil'),
      icon: <FlaskConical className="h-5 w-5" aria-hidden />,
      schema: soilInformationSchema,
    },
    {
      label: t('steps.water'),
      icon: <Droplets className="h-5 w-5" aria-hidden />,
      schema: waterInfoSchema,
    },
    {
      label: t('steps.season'),
      icon: <Calendar className="h-5 w-5" aria-hidden />,
      schema: seasonPreferenceSchema,
    },
    {
      label: t('steps.goals'),
      icon: <Target className="h-5 w-5" aria-hidden />,
      schema: farmingGoalsSchema,
    },
  ];

  const currentSchema = stepConfig[currentStep - 1].schema;

  const form = useForm<StepForms>({
    resolver: zodResolver(currentSchema as any),
    defaultValues: getDefaultValues(currentStep),
    mode: 'onChange',
  });

  function getDefaultValues(step: number): Record<string, unknown> {
    switch (step) {
      case 1:
        return { state: '', district: '', village: '', pincode: '' };
      case 2:
        return { size: undefined, unit: 'acres', ownershipType: 'owned' };
      case 3:
        return { soilType: 'black', phValue: 6.5, organicMatter: 'medium' };
      case 4:
        return { irrigationSource: 'borewell', waterAvailability: 'moderate', rainDependency: false };
      case 5:
        return { kharif: true, rabi: false, zaid: false };
      case 6:
        return { maximumProfit: true, lowRisk: false, waterSaving: false, organicFarming: false };
      default:
        return {};
    }
  }

  const handleNext = useCallback(
    async (data: StepForms) => {
      const newData = mergeStepData(collectedData, currentStep, data);
      setCollectedData(newData);
      setCompletedSteps((prev) => [...new Set([...prev, currentStep])]);

      if (currentStep === TOTAL_STEPS) {
        onSubmit(newData as FarmProfile);
        return;
      }

      setCurrentStep((s) => s + 1);
      form.reset(getDefaultValues(currentStep + 1) as any);
    },
    [currentStep, collectedData, form, onSubmit]
  );

  const handleBack = () => {
    setCurrentStep((s) => Math.max(1, s - 1));
    form.reset(getDefaultValues(currentStep - 1) as any);
  };

  return (
    <div className="vk-wizard rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/30 md:p-8">
      <WizardStepHeader
        steps={stepConfig}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNext)} noValidate>
            <AnimatePresence mode="wait">
              <div key={currentStep}>
                {currentStep === 1 && (
                  <WizardStep
                    title={t('location.title')}
                    description={t('location.description')}
                    icon={<MapPin className="h-5 w-5" />}
                  >
                    <FormField
                      control={form.control as any}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('location.state')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger aria-required="true">
                                <SelectValue placeholder={t('location.statePlaceholder')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {INDIAN_STATES.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control as any}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('location.district')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t('location.districtPlaceholder')}
                              aria-required="true"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control as any}
                        name="village"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('location.village')}</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder={t('location.villagePlaceholder')} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control as any}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('location.pincode')}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="400001"
                                maxLength={6}
                                inputMode="numeric"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </WizardStep>
                )}

                {currentStep === 2 && (
                  <WizardStep
                    title={t('land.title')}
                    description={t('land.description')}
                    icon={<Layers className="h-5 w-5" />}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control as any}
                        name="size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('land.size')}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="0.1"
                                step="0.1"
                                placeholder="5"
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                aria-required="true"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control as any}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('land.unit')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {['acres', 'hectares', 'bigha', 'guntha'].map((u) => (
                                  <SelectItem key={u} value={u}>
                                    {t(`land.units.${u}`)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control as any}
                      name="ownershipType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('land.ownership')}</FormLabel>
                          <div className="grid grid-cols-3 gap-3" role="radiogroup">
                            {(['owned', 'leased', 'shared'] as const).map((type) => (
                              <button
                                key={type}
                                type="button"
                                role="radio"
                                aria-checked={field.value === type}
                                onClick={() => field.onChange(type)}
                                className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                                  field.value === type
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                                }`}
                              >
                                {t(`land.ownershipTypes.${type}`)}
                              </button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </WizardStep>
                )}

                {currentStep === 3 && (
                  <WizardStep
                    title={t('soil.title')}
                    description={t('soil.description')}
                    icon={<FlaskConical className="h-5 w-5" />}
                  >
                    <FormField
                      control={form.control as any}
                      name="soilType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('soil.type')}</FormLabel>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup">
                            {(
                              ['black', 'red', 'alluvial', 'sandy', 'loamy', 'clay', 'laterite'] as const
                            ).map((soil) => (
                              <button
                                key={soil}
                                type="button"
                                role="radio"
                                aria-checked={field.value === soil}
                                onClick={() => field.onChange(soil)}
                                className={`rounded-lg border-2 px-3 py-2.5 text-xs font-medium capitalize transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                  field.value === soil
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                                }`}
                              >
                                {t(`soil.types.${soil}`)}
                              </button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control as any}
                      name="phValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t('soil.ph')}{' '}
                            <span className="ml-1 font-bold text-emerald-600">{field.value}</span>
                          </FormLabel>
                          <FormControl>
                            <div className="pt-2">
                              <Slider
                                min={0}
                                max={14}
                                step={0.1}
                                value={Array.isArray(field.value) ? [...field.value] : [field.value]}
                                onValueChange={([val]) => field.onChange(val)}
                                aria-label={t('soil.ph')}
                                aria-valuemin={0}
                                aria-valuemax={14}
                                aria-valuenow={field.value}
                              />
                              <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                                <span>0 ({t('soil.phLabels.acidic')})</span>
                                <span>7 ({t('soil.phLabels.neutral')})</span>
                                <span>14 ({t('soil.phLabels.alkaline')})</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control as any}
                      name="organicMatter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('soil.organicMatter')}</FormLabel>
                          <div className="grid grid-cols-3 gap-3" role="radiogroup">
                            {(['low', 'medium', 'high'] as const).map((level) => (
                              <button
                                key={level}
                                type="button"
                                role="radio"
                                aria-checked={field.value === level}
                                onClick={() => field.onChange(level)}
                                className={`rounded-xl border-2 px-4 py-3 text-sm font-medium capitalize transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                  field.value === level
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                              >
                                {t(`soil.organicLevels.${level}`)}
                              </button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </WizardStep>
                )}

                {currentStep === 4 && (
                  <WizardStep
                    title={t('water.title')}
                    description={t('water.description')}
                    icon={<Droplets className="h-5 w-5" />}
                  >
                    <FormField
                      control={form.control as any}
                      name="irrigationSource"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('water.irrigationSource')}</FormLabel>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {(
                              ['canal', 'borewell', 'rainwater', 'river', 'tank', 'drip'] as const
                            ).map((src) => (
                              <button
                                key={src}
                                type="button"
                                aria-pressed={field.value === src}
                                onClick={() => field.onChange(src)}
                                className={`rounded-lg border-2 px-3 py-2.5 text-xs font-medium capitalize transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                  field.value === src
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                              >
                                {t(`water.sources.${src}`)}
                              </button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control as any}
                      name="waterAvailability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('water.availability')}</FormLabel>
                          <div className="grid grid-cols-3 gap-3">
                            {(['abundant', 'moderate', 'scarce'] as const).map((a) => (
                              <button
                                key={a}
                                type="button"
                                aria-pressed={field.value === a}
                                onClick={() => field.onChange(a)}
                                className={`rounded-xl border-2 px-4 py-3 text-sm font-medium capitalize transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                  field.value === a
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                              >
                                {t(`water.availabilityLevels.${a}`)}
                              </button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control as any}
                      name="rainDependency"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              aria-label={t('water.rainDependency')}
                            />
                          </FormControl>
                          <div>
                            <FormLabel className="cursor-pointer">
                              {t('water.rainDependency')}
                            </FormLabel>
                            <p className="text-xs text-gray-500">{t('water.rainDependencyHint')}</p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </WizardStep>
                )}

                {currentStep === 5 && (
                  <WizardStep
                    title={t('season.title')}
                    description={t('season.description')}
                    icon={<Calendar className="h-5 w-5" />}
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {(
                        [
                          {
                            key: 'kharif',
                            months: t('season.kharifMonths'),
                            emoji: '🌧️',
                          },
                          {
                            key: 'rabi',
                            months: t('season.rabiMonths'),
                            emoji: '❄️',
                          },
                          {
                            key: 'zaid',
                            months: t('season.zaidMonths'),
                            emoji: '☀️',
                          },
                        ] as const
                      ).map((s) => (
                        <FormField
                          key={s.key}
                          control={form.control as any}
                          name={s.key}
                          render={({ field }) => (
                            <FormItem>
                              <button
                                type="button"
                                aria-pressed={field.value}
                                onClick={() => field.onChange(!field.value)}
                                className={`w-full rounded-2xl border-2 p-5 text-left transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                  field.value
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                                }`}
                              >
                                <div className="mb-2 text-2xl">{s.emoji}</div>
                                <div className="font-semibold capitalize">
                                  {t(`season.seasons.${s.key}`)}
                                </div>
                                <div className="mt-0.5 text-xs text-gray-500">{s.months}</div>
                              </button>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-red-500">
                      {(form.formState.errors as any)?.message}
                    </p>
                  </WizardStep>
                )}

                {currentStep === 6 && (
                  <WizardStep
                    title={t('goals.title')}
                    description={t('goals.description')}
                    icon={<Target className="h-5 w-5" />}
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {(
                        [
                          {
                            key: 'maximumProfit',
                            emoji: '💰',
                            label: t('goals.goals.maximumProfit'),
                            hint: t('goals.hints.maximumProfit'),
                          },
                          {
                            key: 'lowRisk',
                            emoji: '🛡️',
                            label: t('goals.goals.lowRisk'),
                            hint: t('goals.hints.lowRisk'),
                          },
                          {
                            key: 'waterSaving',
                            emoji: '💧',
                            label: t('goals.goals.waterSaving'),
                            hint: t('goals.hints.waterSaving'),
                          },
                          {
                            key: 'organicFarming',
                            emoji: '🌿',
                            label: t('goals.goals.organicFarming'),
                            hint: t('goals.hints.organicFarming'),
                          },
                        ] as const
                      ).map((g) => (
                        <FormField
                          key={g.key}
                          control={form.control as any}
                          name={g.key}
                          render={({ field }) => (
                            <FormItem>
                              <button
                                type="button"
                                aria-pressed={field.value}
                                onClick={() => field.onChange(!field.value)}
                                className={`w-full rounded-2xl border-2 p-5 text-left transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                  field.value
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                                }`}
                              >
                                <div className="mb-2 text-2xl">{g.emoji}</div>
                                <div className="font-semibold">{g.label}</div>
                                <div className="mt-0.5 text-xs text-gray-500">{g.hint}</div>
                              </button>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </WizardStep>
                )}
              </div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6 dark:border-gray-800">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
                aria-label={t('back')}
              >
                <ChevronLeft className="mr-1 h-4 w-4" aria-hidden />
                {t('back')}
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {t('stepOf', { current: currentStep, total: TOTAL_STEPS })}
                </span>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                aria-label={currentStep === TOTAL_STEPS ? t('getRecommendations') : t('next')}
              >
                {currentStep === TOTAL_STEPS ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" aria-hidden />
                    {isLoading ? t('analyzing') : t('getRecommendations')}
                  </>
                ) : (
                  <>
                    {t('next')}
                    <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function mergeStepData(
  existing: Partial<FarmProfile>,
  step: number,
  data: StepForms
): Partial<FarmProfile> {
  switch (step) {
    case 1:
      return { ...existing, location: data as any };
    case 2:
      return { ...existing, landDetails: data as any };
    case 3:
      return { ...existing, soilInformation: data as any };
    case 4:
      return { ...existing, waterInfo: data as any };
    case 5:
      return { ...existing, seasonPreference: data as any };
    case 6:
      return { ...existing, goals: data as any };
    default:
      return existing;
  }
}