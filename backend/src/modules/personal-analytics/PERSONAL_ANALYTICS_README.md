# Personal Analytics Module

Backend routes that match the existing frontend's analytics dashboard
(`frontend/src/features/analytics`), which was built independently of
the platform-wide admin analytics module (`backend/src/modules/analytics`,
Phase 10). This module is scoped to the logged-in farmer.

## Why this module exists

The frontend already calls:
```
GET /analytics/summary
GET /analytics/kpi
GET /analytics/profit-trend
GET /analytics/yield-trend
GET /analytics/disease
GET /analytics/market
GET /analytics/water
GET /analytics/tasks
```

None of these existed on the backend before — only the unrelated
platform-wide admin routes (`/overview`, `/farms`, `/crops`, `/diseases`,
`/schemes`, `/notifications`, `/dashboard`) did. This caused every
frontend analytics widget to either 404 or receive the wrong shape
(`chartData.slice is not a function`).

## What's real vs. stubbed

| Endpoint | Field | Status | Source |
|---|---|---|---|
| `/summary` | `currentSeason` | ✅ Real | `Farm.cropSeason` (most recent farm) |
| `/summary` | `farmPerformance`, `productivityIndex`, `profitabilityScore` | ⚠️ Stub (0) | No formula defined yet |
| `/kpi` | `diseaseIncidents.value` | ✅ Real | `DiseaseReport` count for this user |
| `/kpi` | everything else | ⚠️ Stub (0) | No finance/water/transaction module exists |
| `/profit-trend` | all | ⚠️ Stub ([]) | No finance/transaction module exists |
| `/yield-trend` | `yield` | ⚠️ Approximate | Parsed from `Recommendation.expectedYield`, a free-text AI **estimate** ("25 quintal/acre"), not an actual harvest outcome — there is no harvest-logging module |
| `/disease` | `detected` | ✅ Real | `DiseaseReport.createdAt`, grouped by week |
| `/disease` | `treated` | ⚠️ Stub (0) | No treatment-completion field exists on DiseaseReport |
| `/market` | `avgPrice` | ✅ Real | `MarketPrice.modalPrice`, scoped to this farmer's `Farm.currentCrop` values, grouped by month |
| `/market` | `sold` | ⚠️ Stub (0) | No buy/sell/order module exists |
| `/water` | all | ⚠️ Stub ([]) | No irrigation/water-usage module exists |
| `/tasks` | all | ⚠️ Stub (0) | No task/todo module exists |

Stubbed fields return `0` / empty arrays rather than fabricated numbers,
so the frontend renders an honest empty/zero state instead of crashing
or showing misleading data. When the missing modules (finance, water
usage, tasks, harvest logging) are eventually built, replace the
corresponding stub in `services/personal-analytics.service.ts` with a
real query — each stub has an inline comment marking it.

## Mounting

Mounted at the same `/api/v1/analytics` prefix as the admin module, but
on different path segments, so there's no route collision:

```ts
// app.ts
import { analyticsRouter } from "./modules/analytics"; // admin/platform-wide (Phase 10)
import personalAnalyticsRoutes from "./modules/personal-analytics/routes/personal-analytics.routes"; // this module

app.use(`${env.API_PREFIX}/analytics`, analyticsRouter);
app.use(`${env.API_PREFIX}/analytics`, personalAnalyticsRoutes);
```
