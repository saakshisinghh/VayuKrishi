'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CropRecommendationHero } from './crop-recommendation-hero';
import { FarmProfileWizard } from './farm-profile-wizard';
import { RecommendationLoading } from './recommendation-loading';
import { RecommendationResults } from './recommendation-results';
import { useCropRecommendation } from '../queries/crop-recommendation.query';
import type { FarmProfile } from '../types/crop-recommendation.types';
import type { RecommendationResponse } from '../types/crop-recommendation.types';

// ─── View State ───────────────────────────────────────────────────────────────
type ViewState = 'wizard' | 'loading' | 'results' | 'error';

// ─── Client ───────────────────────────────────────────────────────────────────
export function CropRecommendationClient() {
  const [view, setView] = useState<ViewState>('wizard');
  const [farmProfile, setFarmProfile] = useState<FarmProfile | null>(null);
  const [results, setResults] = useState<RecommendationResponse | null>(null);

  const mutation = useCropRecommendation();

  const handleWizardSubmit = useCallback(
    async (profile: FarmProfile) => {
      setFarmProfile(profile);
      setView('loading');

      try {
        const data = await mutation.mutateAsync(profile);
        setResults(data);
        setView('results');
      } catch {
        setView('error');
      }
    },
    [mutation]
  );

  const handleReset = useCallback(() => {
    setView('wizard');
    setResults(null);
    setFarmProfile(null);
    mutation.reset();
  }, [mutation]);

  return (
    <div className="space-y-6">
      {/* Hero always visible */}
      <CropRecommendationHero
        accuracy={results?.accuracy}
        lastUpdated={results?.generatedAt}
      />

      {/* View switcher */}
      <AnimatePresence mode="wait">
        {view === 'wizard' && (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <FarmProfileWizard
              onSubmit={handleWizardSubmit}
              isLoading={mutation.isPending}
            />
          </motion.div>
        )}

        {view === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <RecommendationLoading />
          </motion.div>
        )}

        {view === 'results' && results && farmProfile && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <RecommendationResults
              data={results}
              farmProfile={farmProfile}
              onReset={handleReset}
            />
          </motion.div>
        )}

        {view === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-12 text-center dark:border-rose-900 dark:bg-rose-950/20"
          >
            <p className="text-lg font-semibold text-rose-700 dark:text-rose-400">
              Something went wrong
            </p>
            <p className="text-sm text-rose-500">
              We could not analyze your farm profile. Please try again.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg bg-rose-100 px-5 py-2.5 text-sm font-medium text-rose-700 hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:bg-rose-900/40 dark:text-rose-300"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
