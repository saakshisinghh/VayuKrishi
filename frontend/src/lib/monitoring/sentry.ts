// sentry.ts
import * as Sentry from "@sentry/nextjs";

export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      replaysSessionSampleRate: 0.05,
      replaysOnErrorSampleRate: 1.0,
      integrations: [
        Sentry.replayIntegration(),
        Sentry.browserTracingIntegration(),
      ],
      beforeSend(event) {
        // Scrub PII: phone numbers
        if (event.extra?.phone) {
          event.extra.phone = "[REDACTED]";
        }
        return event;
      },
    });
  }
}

export function captureException(error: unknown, context?: Record<string, unknown>) {
  if (process.env.NODE_ENV === "production") {
    Sentry.withScope((scope) => {
      if (context) scope.setExtras(context);
      Sentry.captureException(error);
    });
  } else {
    console.error("[Sentry mock]", error, context);
  }
}

export function setUserContext(userId: string, locale: string) {
  Sentry.setUser({ id: userId });
  Sentry.setTag("locale", locale);
}
