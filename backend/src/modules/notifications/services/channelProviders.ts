import { NotificationChannel } from "../types/notification.types";
import { NotificationDocument } from "../notification.model";

/**
 * Every delivery channel implements this interface. The dispatch job
 * and NotificationService only ever talk to `ChannelProvider`, never to
 * a concrete SDK. This is the seam described in the spec diagram:
 *
 *   Notification Service -> Email Provider
 *   Notification Service -> Twilio SMS
 *   Notification Service -> WhatsApp API
 *   Notification Service -> Firebase Push
 *
 * Swapping the stub providers below for real ones (Nodemailer/SES,
 * Twilio, WhatsApp Cloud API, Firebase Admin SDK) requires touching
 * only this file — no controller, service, or job code changes.
 */
export interface DeliveryResult {
  success: boolean;
  providerMessageId?: string;
  error?: string;
}

export interface ChannelProvider {
  channel: NotificationChannel;
  send(notification: NotificationDocument): Promise<DeliveryResult>;
}

/**
 * In-app is "delivered" the moment it's written to Mongo — the client
 * picks it up via GET /notifications. This provider exists mainly to
 * keep the dispatch loop uniform across channels.
 */
class InAppProvider implements ChannelProvider {
  channel = NotificationChannel.IN_APP;

  async send(_notification: NotificationDocument): Promise<DeliveryResult> {
    return { success: true };
  }
}

/**
 * Stub — replace internals with Nodemailer/SES/SendGrid in Phase 10+.
 * Signature and return contract are final; do not change them when
 * wiring the real provider.
 */
class EmailProvider implements ChannelProvider {
  channel = NotificationChannel.EMAIL;

  async send(notification: NotificationDocument): Promise<DeliveryResult> {
    console.log(
      `[EmailProvider:STUB] Would email userId=${notification.userId} title="${notification.title}"`
    );
    return { success: true, providerMessageId: `stub-email-${Date.now()}` };
  }
}

/** Stub — replace internals with Twilio in Phase 10+. */
class SmsProvider implements ChannelProvider {
  channel = NotificationChannel.SMS;

  async send(notification: NotificationDocument): Promise<DeliveryResult> {
    console.log(
      `[SmsProvider:STUB] Would SMS userId=${notification.userId} message="${notification.message}"`
    );
    return { success: true, providerMessageId: `stub-sms-${Date.now()}` };
  }
}

/** Stub — replace internals with WhatsApp Cloud API in Phase 10+. */
class WhatsappProvider implements ChannelProvider {
  channel = NotificationChannel.WHATSAPP;

  async send(notification: NotificationDocument): Promise<DeliveryResult> {
    console.log(
      `[WhatsappProvider:STUB] Would WhatsApp userId=${notification.userId} message="${notification.message}"`
    );
    return {
      success: true,
      providerMessageId: `stub-whatsapp-${Date.now()}`,
    };
  }
}

/** Stub — replace internals with Firebase Admin SDK in Phase 10+. */
class PushProvider implements ChannelProvider {
  channel = NotificationChannel.PUSH;

  async send(notification: NotificationDocument): Promise<DeliveryResult> {
    console.log(
      `[PushProvider:STUB] Would push userId=${notification.userId} title="${notification.title}"`
    );
    return { success: true, providerMessageId: `stub-push-${Date.now()}` };
  }
}

const providers: Record<NotificationChannel, ChannelProvider> = {
  [NotificationChannel.IN_APP]: new InAppProvider(),
  [NotificationChannel.EMAIL]: new EmailProvider(),
  [NotificationChannel.SMS]: new SmsProvider(),
  [NotificationChannel.WHATSAPP]: new WhatsappProvider(),
  [NotificationChannel.PUSH]: new PushProvider(),
};

export const getChannelProvider = (
  channel: NotificationChannel
): ChannelProvider => providers[channel];
