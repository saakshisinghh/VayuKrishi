'use client';

import { Suspense, useState } from 'react';
import {
  useEligibleSchemes,
  useSchemeRecommendations,
  useSchemeApplications,
  useSubmitApplication,
} from '@/features/schemes/hooks/use-schemes';
import { SchemesHero } from '@/features/schemes/components/schemes-hero';
import { EligibilityScoreCard } from '@/features/schemes/components/eligibility-score-card';
import { SchemeCard } from '@/features/schemes/components/scheme-card';
import { SchemeRecommendationPanel } from '@/features/schemes/components/scheme-recommendation-panel';
import { ApplicationTracker } from '@/features/schemes/components/application-tracker';
import { BenefitsSummaryCard } from '@/features/schemes/components/benefits-summary-card';
import { SchemeSkeleton } from '@/features/farm-health/components/loading-skeletons';
import { SchemeError } from '@/features/farm-health/components/error-states';

function SchemesContent() {
  const { data: schemesData, isLoading, isError, refetch } = useEligibleSchemes();
  const { data: recommendations } = useSchemeRecommendations();
  const { data: applications } = useSchemeApplications();
  const submitApp = useSubmitApplication();

  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);

  if (isLoading) return <SchemeSkeleton />;
  if (isError || !schemesData) return <SchemeError onRetry={refetch} />;

  const { schemes, eligibility, summary } = schemesData;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <SchemesHero summary={summary} />

      {/* Recommendations + Eligibility */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {recommendations && (
          <SchemeRecommendationPanel
            recommendations={recommendations}
            onSelectScheme={setSelectedSchemeId}
          />
        )}
        <EligibilityScoreCard
          scores={eligibility}
          onSelectScheme={setSelectedSchemeId}
        />
      </div>

      {/* Benefits summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <BenefitsSummaryCard eligibilityScores={eligibility} />
        </div>

        {/* Application tracker */}
        <div className="lg:col-span-2">
          {applications && <ApplicationTracker applications={applications} />}
        </div>
      </div>

      {/* Scheme cards */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-white">All Eligible Schemes</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {schemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              eligibility={eligibility.find((e) => e.schemeId === scheme.id)}
              onApply={(id) => submitApp.mutate(id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SchemesPage() {
  return (
    <main className="min-h-screen bg-[#080d08] p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <Suspense fallback={<SchemeSkeleton />}>
          <SchemesContent />
        </Suspense>
      </div>
    </main>
  );
}
