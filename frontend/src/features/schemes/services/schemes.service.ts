import type {
  GovernmentScheme,
  EligibilityScore,
  SchemeApplication,
  SchemeRecommendation,
  SchemeSummary,
} from '../types/scheme.types';

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockSchemes: GovernmentScheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN',
    nameLocal: 'पीएम-किसान',
    category: 'subsidy',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Direct income support of ₹6,000 per year to small and marginal farmer families.',
    benefits: [
      { type: 'cash', description: 'Direct cash transfer to bank account', value: 6000, unit: '₹/year' },
    ],
    subsidyAmount: 6000,
    maxBenefitAmount: 6000,
    eligibilityCriteria: [
      { criterion: 'Small or marginal farmer (less than 2 hectares)', met: true, required: true },
      { criterion: 'Valid Aadhaar card', met: true, required: true },
      { criterion: 'Bank account linked to Aadhaar', met: true, required: true },
      { criterion: 'Not a government employee', met: true, required: true },
    ],
    documentsRequired: ['Aadhaar Card', 'Land Records (7/12)', 'Bank Passbook', 'Mobile Number'],
    applicationProcess: [
      { stepNumber: 1, title: 'Register on PM-KISAN portal', description: 'Visit pmkisan.gov.in and register with Aadhaar', estimatedTime: '15 mins' },
      { stepNumber: 2, title: 'Upload Documents', description: 'Upload land records and identity proof', estimatedTime: '20 mins' },
      { stepNumber: 3, title: 'Verification', description: 'Local agriculture officer will verify details', estimatedTime: '7-10 days' },
    ],
    applicationUrl: 'https://pmkisan.gov.in',
    launchDate: '2019-02-24',
    isActive: true,
    priority: 'high',
  },
  {
    id: 'pmfby',
    name: 'PMFBY',
    nameLocal: 'फसल बीमा योजना',
    category: 'insurance',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Pradhan Mantri Fasal Bima Yojana provides financial support to farmers suffering crop loss due to calamities.',
    benefits: [
      { type: 'insurance', description: 'Crop insurance coverage', value: 100000, unit: '₹/season' },
    ],
    maxBenefitAmount: 100000,
    eligibilityCriteria: [
      { criterion: 'Farmer growing notified crops', met: true, required: true },
      { criterion: 'Land must be cultivated', met: true, required: true },
      { criterion: 'KCC/loan account holder', met: false, required: false },
    ],
    documentsRequired: ['Aadhaar Card', 'Land Records', 'Bank Account', 'Sowing Certificate'],
    applicationProcess: [
      { stepNumber: 1, title: 'Apply via bank or CSC', description: 'Visit nearest bank or Common Service Centre', estimatedTime: '30 mins' },
      { stepNumber: 2, title: 'Pay premium', description: 'Premium is 2% for Kharif, 1.5% for Rabi', estimatedTime: '10 mins' },
      { stepNumber: 3, title: 'Receive policy document', description: 'Policy document issued within 15 days', estimatedTime: '15 days' },
    ],
    deadline: '2024-07-31',
    launchDate: '2016-01-13',
    isActive: true,
    priority: 'high',
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card',
    nameLocal: 'किसान क्रेडिट कार्ड',
    category: 'loan',
    ministry: 'Ministry of Finance',
    description: 'Provides farmers with timely credit support for their agricultural operations at subsidized interest rates.',
    benefits: [
      { type: 'cash', description: 'Revolving credit up to ₹3 lakh at 7% interest', value: 300000, unit: '₹' },
    ],
    maxBenefitAmount: 300000,
    eligibilityCriteria: [
      { criterion: 'Farmer, tenant farmer, or sharecropper', met: true, required: true },
      { criterion: 'Age 18-75 years', met: true, required: true },
      { criterion: 'Land ownership or lease agreement', met: true, required: true },
    ],
    documentsRequired: ['Aadhaar Card', 'PAN Card', 'Land Records', 'Passport Photo', 'Address Proof'],
    applicationProcess: [
      { stepNumber: 1, title: 'Visit nearest bank', description: 'Approach any nationalized bank or cooperative bank', estimatedTime: '1 hour' },
      { stepNumber: 2, title: 'Fill KCC application', description: 'Submit form with required documents', estimatedTime: '30 mins' },
      { stepNumber: 3, title: 'Bank verification', description: 'Bank verifies land records and creditworthiness', estimatedTime: '7-14 days' },
      { stepNumber: 4, title: 'Card issuance', description: 'KCC card issued with credit limit', estimatedTime: '3-5 days' },
    ],
    launchDate: '1998-08-01',
    isActive: true,
    priority: 'medium',
  },
  {
    id: 'pmksy',
    name: 'PMKSY',
    nameLocal: 'सिंचाई योजना',
    category: 'equipment',
    ministry: 'Ministry of Jal Shakti',
    description: 'Pradhan Mantri Krishi Sinchayee Yojana — Har Khet Ko Paani and More Crop Per Drop.',
    benefits: [
      { type: 'subsidy', description: 'Subsidy on drip/sprinkler irrigation installation', value: 80, unit: '% subsidy' },
      { type: 'equipment', description: 'Micro-irrigation equipment at subsidized rates' },
    ],
    maxBenefitAmount: 50000,
    eligibilityCriteria: [
      { criterion: 'Farmer with irrigable land', met: true, required: true },
      { criterion: 'Small/marginal/large farmer', met: true, required: true },
      { criterion: 'Willing to adopt micro-irrigation', met: true, required: true },
    ],
    documentsRequired: ['Land Records', 'Aadhaar Card', 'Bank Account', 'Soil Health Card'],
    applicationProcess: [
      { stepNumber: 1, title: 'Apply at district horticulture office', description: 'Submit application with land documents', estimatedTime: '1 hour' },
      { stepNumber: 2, title: 'Survey and inspection', description: 'Officials will survey your farm', estimatedTime: '5-7 days' },
      { stepNumber: 3, title: 'Equipment installation', description: 'Approved vendor installs irrigation system', estimatedTime: '1-2 weeks' },
      { stepNumber: 4, title: 'Subsidy disbursement', description: 'Subsidy credited to bank account', estimatedTime: '30 days' },
    ],
    launchDate: '2015-07-01',
    isActive: true,
    priority: 'medium',
  },
];

export const mockEligibilityScores: EligibilityScore[] = [
  {
    schemeId: 'pm-kisan',
    schemeName: 'PM-KISAN',
    category: 'subsidy',
    eligibilityPercent: 100,
    matchScore: 92,
    status: 'eligible',
    reasons: ['Land size matches criteria', 'Aadhaar verified', 'Bank account linked'],
    potentialBenefit: 6000,
  },
  {
    schemeId: 'pmfby',
    schemeName: 'PMFBY',
    category: 'insurance',
    eligibilityPercent: 95,
    matchScore: 88,
    status: 'eligible',
    reasons: ['Growing notified kharif crop', 'Land is cultivated', 'Minor: no KCC account (optional)'],
    potentialBenefit: 50000,
  },
  {
    schemeId: 'kcc',
    schemeName: 'Kisan Credit Card',
    category: 'loan',
    eligibilityPercent: 100,
    matchScore: 85,
    status: 'eligible',
    reasons: ['Age criteria met', 'Land ownership confirmed', 'Clean credit history'],
    potentialBenefit: 150000,
  },
  {
    schemeId: 'pmksy',
    schemeName: 'PMKSY',
    category: 'equipment',
    eligibilityPercent: 80,
    matchScore: 75,
    status: 'partially_eligible',
    reasons: ['Has irrigable land', 'Soil health card pending'],
    potentialBenefit: 40000,
  },
];

export const mockApplications: SchemeApplication[] = [
  {
    id: 'app-001',
    schemeId: 'pm-kisan',
    schemeName: 'PM-KISAN',
    applicationDate: '2024-04-01',
    status: 'approved',
    submittedDocuments: ['Aadhaar Card', 'Land Records', 'Bank Passbook'],
    pendingDocuments: [],
    lastUpdated: '2024-04-15',
    referenceNumber: 'PMKISAN-2024-12345',
  },
  {
    id: 'app-002',
    schemeId: 'pmfby',
    schemeName: 'PMFBY',
    applicationDate: '2024-06-15',
    status: 'in_progress',
    submittedDocuments: ['Aadhaar Card', 'Land Records'],
    pendingDocuments: ['Sowing Certificate'],
    lastUpdated: '2024-06-20',
    referenceNumber: 'PMFBY-2024-67890',
  },
];

export const mockSchemeSummary: SchemeSummary = {
  totalEligible: 4,
  totalPotentialBenefit: 246000,
  applicationsInProgress: 1,
  applicationsApproved: 1,
  pendingApplications: 2,
};

// ─── Service Functions ────────────────────────────────────────────────────────

export async function fetchEligibleSchemes(farmerId: string): Promise<{
  schemes: GovernmentScheme[];
  eligibility: EligibilityScore[];
  summary: SchemeSummary;
}> {
  await new Promise((r) => setTimeout(r, 900));
  return {
    schemes: mockSchemes,
    eligibility: mockEligibilityScores,
    summary: mockSchemeSummary,
  };
}

export async function fetchSchemeRecommendations(farmerId: string): Promise<SchemeRecommendation[]> {
  await new Promise((r) => setTimeout(r, 600));
  return mockSchemes
    .filter((_, i) => i < 3)
    .map((scheme, i) => ({
      scheme,
      eligibilityScore: mockEligibilityScores[i],
      whyRecommended: ['Matches your land size', 'Your crop type qualifies', 'Deadline approaching'],
      potentialBenefit: mockEligibilityScores[i].potentialBenefit,
      priority: scheme.priority,
      actionRequired: 'Apply now',
    }));
}

export async function fetchApplications(farmerId: string): Promise<SchemeApplication[]> {
  await new Promise((r) => setTimeout(r, 500));
  return mockApplications;
}

export async function submitApplication(schemeId: string, farmerId: string): Promise<{ success: boolean; referenceNumber: string }> {
  await new Promise((r) => setTimeout(r, 1000));
  return { success: true, referenceNumber: `APP-${Date.now()}` };
}
