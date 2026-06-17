export type SchemeStatus = 'eligible' | 'partially_eligible' | 'ineligible' | 'applied' | 'approved' | 'rejected';
export type ApplicationStatus = 'not_started' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
export type SchemePriority = 'high' | 'medium' | 'low';
export type SchemeCategory = 'subsidy' | 'insurance' | 'loan' | 'training' | 'equipment' | 'seed';

export interface GovernmentScheme {
  id: string;
  name: string;
  nameLocal?: string;
  category: SchemeCategory;
  ministry: string;
  description: string;
  benefits: SchemeBenefit[];
  subsidyAmount?: number;
  maxBenefitAmount?: number;
  eligibilityCriteria: EligibilityCriterion[];
  documentsRequired: string[];
  applicationProcess: ApplicationStep[];
  applicationUrl?: string;
  deadline?: string;
  launchDate: string;
  isActive: boolean;
  priority: SchemePriority;
}

export interface SchemeBenefit {
  type: 'cash' | 'subsidy' | 'equipment' | 'training' | 'insurance';
  description: string;
  value?: number;
  unit?: string;
}

export interface EligibilityCriterion {
  criterion: string;
  met: boolean;
  required: boolean;
}

export interface ApplicationStep {
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime: string;
}

export interface EligibilityScore {
  schemeId: string;
  schemeName: string;
  category: SchemeCategory;
  eligibilityPercent: number;
  matchScore: number;
  status: SchemeStatus;
  reasons: string[];
  potentialBenefit: number;
}

export interface SchemeApplication {
  id: string;
  schemeId: string;
  schemeName: string;
  applicationDate: string;
  status: ApplicationStatus;
  submittedDocuments: string[];
  pendingDocuments: string[];
  lastUpdated: string;
  notes?: string;
  referenceNumber?: string;
}

export interface SchemeRecommendation {
  scheme: GovernmentScheme;
  eligibilityScore: EligibilityScore;
  whyRecommended: string[];
  potentialBenefit: number;
  priority: SchemePriority;
  actionRequired: string;
}

export interface SchemeSummary {
  totalEligible: number;
  totalPotentialBenefit: number;
  applicationsInProgress: number;
  applicationsApproved: number;
  pendingApplications: number;
}
