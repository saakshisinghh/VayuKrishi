// src/lib/monitoring/analytics.ts
type EventProperties = Record<string, string | number | boolean | null>;

class Analytics {
  private isEnabled = process.env.NODE_ENV === "production";

  track(event: string, properties?: EventProperties) {
    if (!this.isEnabled) {
      console.log(`[Analytics] ${event}`, properties ?? "");
      return;
    }
    // PostHog / Vercel Analytics integration
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture(event, properties);
    }
    if (typeof window !== "undefined" && (window as any).va) {
      (window as any).va("track", event, properties);
    }
  }

  identify(userId: string, traits?: EventProperties) {
    if (!this.isEnabled) {
      console.log(`[Analytics] identify ${userId}`, traits ?? "");
      return;
    }
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.identify(userId, traits);
    }
  }

  page(name: string, properties?: EventProperties) {
    this.track("$pageview", { page: name, ...properties });
  }

  // Named events
  cropRecommendationViewed(cropName: string) {
    this.track("crop_recommendation_viewed", { crop: cropName });
  }

  diseaseDetectionCompleted(disease: string, confidence: number) {
    this.track("disease_detection_completed", { disease, confidence });
  }

  voiceQuerySubmitted(language: string) {
    this.track("voice_query_submitted", { language });
  }

  marketPriceViewed(commodity: string) {
    this.track("market_price_viewed", { commodity });
  }

  schemeMatchViewed(schemeCount: number) {
    this.track("scheme_match_viewed", { scheme_count: schemeCount });
  }
}

export const analytics = new Analytics();
