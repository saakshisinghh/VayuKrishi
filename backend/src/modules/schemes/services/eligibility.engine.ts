import { IScheme, FarmerCategory } from '../scheme.model';
import { FarmerProfile, EligibilityResult } from '../types/scheme.types';

// ─── Scoring weights (add up to 100) ─────────────────────────────────────────

const WEIGHTS = {
  state:          20,
  farmSize:       20,
  farmerCategory: 15,
  cropType:       15,
  waterSource:    10,
  age:            10,
  gender:          5,
  income:          5,
};

// ─── Individual criterion checkers ───────────────────────────────────────────

function checkState(profile: FarmerProfile, criteria: IScheme['eligibilityCriteria']): boolean {
  if (!criteria.states || criteria.states.length === 0) return true;
  return criteria.states.map(s => s.toLowerCase()).includes(profile.state.toLowerCase());
}

function checkFarmSize(profile: FarmerProfile, criteria: IScheme['eligibilityCriteria']): boolean {
  const { minFarmSize, maxFarmSize } = criteria;
  if (minFarmSize !== null && profile.farmSizeHa < minFarmSize) return false;
  if (maxFarmSize !== null && profile.farmSizeHa > maxFarmSize) return false;
  return true;
}

function checkFarmerCategory(profile: FarmerProfile, criteria: IScheme['eligibilityCriteria']): boolean {
  if (!criteria.farmerCategories || criteria.farmerCategories.length === 0) return true;
  return (
    criteria.farmerCategories.includes(FarmerCategory.ALL) ||
    criteria.farmerCategories.includes(profile.category)
  );
}

function checkCropType(profile: FarmerProfile, criteria: IScheme['eligibilityCriteria']): boolean {
  if (!criteria.cropTypes || criteria.cropTypes.length === 0) return true;
  return profile.cropTypes.some(c =>
    criteria.cropTypes!.map(ct => ct.toLowerCase()).includes(c.toLowerCase()),
  );
}

function checkWaterSource(profile: FarmerProfile, criteria: IScheme['eligibilityCriteria']): boolean {
  if (!criteria.waterSources || criteria.waterSources.length === 0) return true;
  return profile.waterSources.some(w =>
    criteria.waterSources!.map(ws => ws.toLowerCase()).includes(w.toLowerCase()),
  );
}

function checkAge(profile: FarmerProfile, criteria: IScheme['eligibilityCriteria']): boolean {
  if (profile.age === null) return true; // unknown age — don't penalise
  const { minAge, maxAge } = criteria;
  if (minAge !== null && profile.age < minAge) return false;
  if (maxAge !== null && profile.age > maxAge) return false;
  return true;
}

function checkGender(profile: FarmerProfile, criteria: IScheme['eligibilityCriteria']): boolean {
  if (criteria.genderRestriction === 'any') return true;
  return profile.gender === criteria.genderRestriction;
}

function checkIncome(profile: FarmerProfile, criteria: IScheme['eligibilityCriteria']): boolean {
  if (criteria.incomeLimitAnnual === null || criteria.incomeLimitAnnual === undefined) return true;
  if (profile.annualIncome === null) return true; // unknown income — don't penalise
  return profile.annualIncome <= criteria.incomeLimitAnnual;
}

// ─── Main Engine ──────────────────────────────────────────────────────────────

/**
 * checkEligibility
 *
 * Compares a farmer's profile against a scheme's eligibility criteria.
 * Returns a score (0–100), matched criteria list, and missing criteria list.
 *
 * AI-READINESS:
 * This function is pure (no side effects). A FastAPI matching service can
 * call this logic independently or replace it entirely by returning the
 * same EligibilityResult shape.
 */
export function checkEligibility(
  profile: FarmerProfile,
  scheme:  IScheme,
): EligibilityResult {
  const ec = scheme.eligibilityCriteria;
  const matchedCriteria: string[]  = [];
  const missingCriteria: string[]  = [];
  let   earnedScore                = 0;

  const checks: Array<{
    key:     keyof typeof WEIGHTS;
    label:   string;
    passes:  boolean;
  }> = [
    { key: 'state',          label: `State (${profile.state})`,                   passes: checkState(profile, ec) },
    { key: 'farmSize',       label: `Farm size (${profile.farmSizeHa} ha)`,       passes: checkFarmSize(profile, ec) },
    { key: 'farmerCategory', label: `Farmer category (${profile.category})`,      passes: checkFarmerCategory(profile, ec) },
    { key: 'cropType',       label: `Crop type (${profile.cropTypes.join(', ')})`,passes: checkCropType(profile, ec) },
    { key: 'waterSource',    label: 'Water source',                                passes: checkWaterSource(profile, ec) },
    { key: 'age',            label: 'Age criteria',                                passes: checkAge(profile, ec) },
    { key: 'gender',         label: 'Gender criteria',                             passes: checkGender(profile, ec) },
    { key: 'income',         label: 'Income limit',                                passes: checkIncome(profile, ec) },
  ];

  for (const { key, label, passes } of checks) {
    if (passes) {
      earnedScore += WEIGHTS[key];
      matchedCriteria.push(label);
    } else {
      missingCriteria.push(label);
    }
  }

  // Add any additional free-text criteria as context only (not scored)
  if (ec.additionalCriteria && ec.additionalCriteria.length > 0) {
    matchedCriteria.push(...ec.additionalCriteria.map(c => `[Additional] ${c}`));
  }

  const eligible = missingCriteria.length === 0;

  return {
    eligible,
    score: earnedScore,
    matchedCriteria,
    missingCriteria,
    details: {
      weights:    WEIGHTS,
      schemeName: scheme.schemeName,
      schemeCode: scheme.schemeCode,
    },
  };
}
