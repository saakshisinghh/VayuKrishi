import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { CropRecommendationClient } from '@/features/crop-recommendation/components/crop-recommendation-client';

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'cropRecommendation.meta' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CropRecommendationPage() {
  return (
    <main className="container mx-auto max-w-5xl space-y-6 px-4 py-6 md:px-6 md:py-8">
      <Suspense
        fallback={
          <div className="h-[600px] animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
        }
      >
        <CropRecommendationClient />
      </Suspense>
    </main>
  );
}
