import { Suspense } from 'react';
import { CropRecommendationClient } from '@/features/crop-recommendation/components/crop-recommendation-client';

export default function CropRecommendationPage() {
  return (
    <main className="container mx-auto max-w-5xl space-y-6 px-4 py-6 md:px-6 md:py-8">
      <Suspense fallback={<div className="h-[600px] animate-pulse rounded-2xl bg-gray-100" />}>
        <CropRecommendationClient />
      </Suspense>
    </main>
  );
}