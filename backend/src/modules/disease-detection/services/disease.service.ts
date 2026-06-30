import { Types } from 'mongoose';
import { diseaseRepository } from '../repositories/disease.repository';
import { detectDisease as callAi } from '../../../integrations/ai/disease-ai-client';
import { DetectionStatus, AiProvider, IDiseaseReport } from '../disease.model';
import {
  DetectDiseaseInput,
   FindHistoryFilter,
  GetHistoryQuery,
  PaginatedResult,
  UserRole,
  AuthUser,
} from '../types/disease.types';

// ─── Custom errors ────────────────────────────────────────────────────────────

export class NotFoundError       extends Error { constructor(msg: string) { super(msg); this.name = 'NotFoundError'; } }
export class ForbiddenError      extends Error { constructor(msg: string) { super(msg); this.name = 'ForbiddenError'; } }
export class BadRequestError     extends Error { constructor(msg: string) { super(msg); this.name = 'BadRequestError'; } }
export class ExternalServiceError extends Error { constructor(msg: string) { super(msg); this.name = 'ExternalServiceError'; } }

// ─── Helper – resolve image URL from media document ──────────────────────────

function resolveImageUrl(mediaDoc: Record<string, unknown> | null): string {
  if (!mediaDoc) return '';
  // Handles both flat (lean) and populated mediaId
  const url = (mediaDoc as { url?: string }).url;
  return url ?? '';
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class DiseaseService {

  /**
   * POST /detect
   * Farmer submits cropName + farmId + mediaId.
   * Service calls AI, saves report, returns result.
   */
  async detectDisease(
    input: DetectDiseaseInput,
    user: AuthUser,
  ): Promise<IDiseaseReport> {
    const userId  = new Types.ObjectId(user.userId);
    const farmId  = new Types.ObjectId(input.farmId);
    const mediaId = new Types.ObjectId(input.mediaId);

    // ── 1. Create a PENDING record immediately ────────────────────────────
    const pendingReport = await diseaseRepository.create({
      userId,
      farmId,
      mediaId,
      cropName:       input.cropName,
      analysis:       null,
      status:         DetectionStatus.PENDING,
      aiProvider:     AiProvider.MOCK,        // overwritten after AI call
      processingTime: null,
    });

    // ── 2. Resolve the image URL from stored media doc ────────────────────
    //    We populate mediaId when we read it back; pass whatever URL we can.
    const mediaDoc  = pendingReport.mediaId as unknown as { url?: string } | null;
    const imageUrl  = resolveImageUrl(mediaDoc as Record<string, unknown> | null) 
                      || `media://${input.mediaId}`;

    // ── 3. Call AI service ────────────────────────────────────────────────
    let analysis      = null;
    let status        = DetectionStatus.FAILED;
    let processingTime: number | null = null;
    let aiProvider    = AiProvider.MOCK;

    try {
      const aiResult = await callAi({
        cropName: input.cropName,
        imageUrl,
        mediaId:  input.mediaId,
      });

      analysis       = {
        diseaseName:        aiResult.diseaseName,
        confidence:         aiResult.confidence,
        severity:           aiResult.severity,
        affectedArea:       aiResult.affectedArea,
        cause:              aiResult.cause,
        treatmentPlan:      aiResult.treatmentPlan,
        preventiveMeasures: aiResult.preventiveMeasures,
      };
      status         = DetectionStatus.COMPLETED;
      processingTime = aiResult.processingTime ?? null;
      aiProvider     = aiResult.provider ?? AiProvider.MOCK;

    } catch (err) {
      // Mark as failed but do NOT throw — save the failed state
      console.error('[DiseaseService] AI call failed:', (err as Error).message);
    }

    // ── 4. Update report with AI result ──────────────────────────────────
    const updatedReport = await diseaseRepository.update(pendingReport._id, {
      analysis,
      status,
      processingTime,
      aiProvider,
    } as Partial<IDiseaseReport>);

    if (!updatedReport) {
      throw new NotFoundError('Disease report not found after update.');
    }

    return updatedReport;
  }

  // ─── GET /history ─────────────────────────────────────────────────────────

  async getHistory(
    query: GetHistoryQuery,
    user: AuthUser,
  ): Promise<PaginatedResult<IDiseaseReport>> {
    const { page = 1, limit = 10, cropName, severity, farmId, sort = 'newest' } = query;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const filter: Record<string, any> = { isDeleted: false };

    // Admins see all; everyone else sees only their own
    if (user.role !== UserRole.ADMIN) {
      filter.userId = new Types.ObjectId(user.userId);
    }
    if (farmId)   filter.farmId   = new Types.ObjectId(farmId);
    if (cropName) filter.cropName = { $regex: cropName, $options: 'i' };
    if (severity) filter['analysis.severity'] = severity;

    return diseaseRepository.findHistory(filter as FindHistoryFilter, page, limit, sort);
  }

  // ─── GET /history/:id ────────────────────────────────────────────────────

  async getDiseaseReportById(id: string, user: AuthUser): Promise<IDiseaseReport> {
    const report = await diseaseRepository.findById(id);

    if (!report) {
      throw new NotFoundError('Disease report not found.');
    }

    const reportUserId = (report.userId as any)._id ? (report.userId as any)._id.toString() : report.userId.toString(); const isOwner = reportUserId === user.userId.toString();
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('Access denied.');
    }

    return report;
  }

  // ─── PATCH /verify/:id ───────────────────────────────────────────────────

  async verifyReport(id: string, user: AuthUser): Promise<IDiseaseReport> {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.CONSULTANT) {
      throw new ForbiddenError('Only admins or consultants can verify reports.');
    }

    const report = await diseaseRepository.findById(id);
    if (!report) {
      throw new NotFoundError('Disease report not found.');
    }

    if (report.status !== DetectionStatus.COMPLETED) {
      throw new BadRequestError('Only completed reports can be verified.');
    }

    if (report.verifiedByExpert) {
      throw new BadRequestError('Report has already been verified.');
    }

    const updated = await diseaseRepository.update(id, {
      verifiedByExpert: true,
    } as Partial<IDiseaseReport>);

    if (!updated) throw new NotFoundError('Disease report not found.');
    return updated;
  }

  // ─── DELETE /history/:id ─────────────────────────────────────────────────

  async deleteReport(id: string, user: AuthUser): Promise<void> {
    const report = await diseaseRepository.findById(id);

    if (!report) {
      throw new NotFoundError('Disease report not found.');
    }

    const reportUserId = (report.userId as any)._id ? (report.userId as any)._id.toString() : report.userId.toString(); const isOwner = reportUserId === user.userId.toString();
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('Access denied.');
    }

    await diseaseRepository.softDelete(id);
  }

  // ─── GET /history/:id/download ───────────────────────────────────────────

  async generateReportText(id: string, user: AuthUser): Promise<string> {
    const report = await this.getDiseaseReportById(id, user);

    const lines: string[] = [
      'VAYUKRISHI — DISEASE DETECTION REPORT',
      '======================================',
      `Crop: ${report.cropName}`,
      `Status: ${report.status}`,
      `Date: ${report.createdAt.toISOString()}`,
      '',
    ];

    if (report.analysis) {
      lines.push(
        `Disease: ${report.analysis.diseaseName}`,
        `Confidence: ${report.analysis.confidence}%`,
        `Severity: ${report.analysis.severity}`,
        `Affected Area: ${report.analysis.affectedArea}%`,
        `Cause: ${report.analysis.cause}`,
        '',
        'Treatment Plan:',
        ...report.analysis.treatmentPlan.map(
          (t) => `  ${t.step}. ${t.action} — ${t.product} (${t.quantity})`
        ),
        '',
        'Preventive Measures:',
        ...report.analysis.preventiveMeasures.map((p) => `  - ${p}`)
      );
    } else {
      lines.push('Analysis not available.');
    }

    return lines.join('\n');
  }

  // ─── POST /history/:id/share ──────────────────────────────────────────────

  async generateShareUrl(id: string, user: AuthUser): Promise<string> {
    // Confirms access (throws NotFoundError/ForbiddenError if not owner/admin)
    await this.getDiseaseReportById(id, user);

    const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:3000';
    return `${clientUrl}/disease-detection/report/${id}`;
  }
}

export const diseaseService = new DiseaseService();