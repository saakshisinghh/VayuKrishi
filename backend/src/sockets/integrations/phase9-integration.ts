/**
 * phase9-integration.ts
 *
 * Drop-in socket emit calls to wire into your existing Phase 9 jobs.
 * Import SocketService and call the relevant method from each job.
 */

import { SocketService } from '../services/socket.service';
import { NotificationPayload, MarketUpdatePayload, PriceAlertPayload } from '../socket.types';

// ─────────────────────────────────────────────────────────────
// Phase 9: NotificationService → emit to target user
// Add this call inside createNotification() after DB insert
// ─────────────────────────────────────────────────────────────
export async function emitNotificationCreated(
  userId: string,
  notification: {
    _id: string;
    title: string;
    message: string;
    type: NotificationPayload['type'];
    priority: NotificationPayload['priority'];
  }
): Promise<void> {
  await SocketService.sendNotification(userId, {
    notificationId: notification._id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    priority: notification.priority,
    createdAt: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────────────────────
// Phase 9: market-sync.job.ts → emit price update to commodity room
// Add inside the price-sync loop after upsertting each MarketPrice doc
// ─────────────────────────────────────────────────────────────
export function emitMarketPriceUpdate(update: {
  commodity: string;
  state: string;
  market: string;
  pricePerQuintal: number;
  previousPrice?: number;
}): void {
  const changePercent =
    update.previousPrice && update.previousPrice > 0
      ? parseFloat(
          (((update.pricePerQuintal - update.previousPrice) / update.previousPrice) * 100).toFixed(2)
        )
      : undefined;

  const payload: MarketUpdatePayload = {
    commodity: update.commodity,
    state: update.state,
    market: update.market,
    pricePerQuintal: update.pricePerQuintal,
    previousPrice: update.previousPrice,
    changePercent,
    updatedAt: new Date().toISOString(),
  };

  SocketService.sendMarketUpdate(update.commodity, payload);

  // Emit price alert if change > 5%
  if (changePercent !== undefined && Math.abs(changePercent) >= 5) {
    const alertPayload: PriceAlertPayload = {
      commodity: update.commodity,
      alertType: changePercent > 0 ? 'surge' : 'drop',
      currentPrice: update.pricePerQuintal,
      previousPrice: update.previousPrice ?? 0,
      changePercent,
      message: `${update.commodity} price ${changePercent > 0 ? 'surged' : 'dropped'} by ${Math.abs(changePercent)}% in ${update.market}, ${update.state}`,
    };
    SocketService.emitToRoom(`commodity:${update.commodity.toLowerCase()}`, 'market:price-alert', alertPayload);
  }
}

// ─────────────────────────────────────────────────────────────
// Phase 9: disease-risk.job.ts → broadcast disease alert by state
// Call when outbreak risk score crosses threshold
// ─────────────────────────────────────────────────────────────
export function emitDiseaseAlert(alert: {
  state: string;
  diseaseName: string;
  affectedCrops: string[];
  riskLevel: 'medium' | 'high' | 'critical';
  message: string;
}): void {
  SocketService.sendDiseaseAlert(alert.state, {
    notificationId: `disease_alert_${Date.now()}`,
    title: `Disease Alert: ${alert.diseaseName}`,
    message: alert.message,
    type: 'disease_alert',
    priority: alert.riskLevel === 'critical' ? 'critical' : alert.riskLevel === 'high' ? 'high' : 'medium',
    data: { diseaseName: alert.diseaseName, affectedCrops: alert.affectedCrops, state: alert.state },
    createdAt: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────────────────────
// Phase 9: scheme-sync.job.ts → emit scheme alert to state room
// Call after inserting/updating a scheme in DB
// ─────────────────────────────────────────────────────────────
export function emitSchemeAlert(scheme: {
  state: string;
  schemeTitle: string;
  schemeId: string;
  message: string;
}): void {
  SocketService.sendSchemeAlert(scheme.state, {
    notificationId: `scheme_alert_${scheme.schemeId}`,
    title: `New Scheme: ${scheme.schemeTitle}`,
    message: scheme.message,
    type: 'scheme_alert',
    priority: 'medium',
    data: { schemeId: scheme.schemeId },
    createdAt: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────────────────────
// Phase 9: Any Bull job → emit job progress to job owner
// Call inside job processor's progress/complete/failed hooks
// ─────────────────────────────────────────────────────────────
export async function emitJobStatus(
  userId: string,
  job: {
    id: string;
    type: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    progress?: number;
    result?: unknown;
    error?: string;
  }
): Promise<void> {
  await SocketService.sendJobStatus(userId, {
    jobId: String(job.id),
    jobType: job.type,
    status: job.status,
    progress: job.progress,
    result: job.result,
    error: job.error,
  });
}
