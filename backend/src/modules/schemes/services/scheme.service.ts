import { Types } from 'mongoose';
import { schemeRepository }     from '../repositories/scheme.repository';
import { applicationRepository } from '../repositories/application.repository';
import { checkEligibility }     from './eligibility.engine';
import { MOCK_SCHEMES }         from './mock-schemes.data';
import * as cache               from '../../../config/redis';
import {
  AuthUser,
  UserRole,
  FarmerProfile,
  EligibilityResult,
  PaginatedResult,
  CheckEligibilityInput,
  ApplyBody,
  ListSchemesQuery,
  SearchSchemesQuery,
  ListApplicationsQuery,
  UpdateStatusBody,
} from '../types/scheme.types';
import { IScheme, FarmerCategory } from '../scheme.model';
import { IApplication, ApplicationStatus } from '../application.model';

// ─── Custom errors ────────────────────────────────────────────────────────────

export class NotFoundError   extends Error { constructor(m: string) { super(m); this.name = 'NotFoundError'; } }
export class ForbiddenError  extends Error { constructor(m: string) { super(m); this.name = 'ForbiddenError'; } }
export class ConflictError   extends Error { constructor(m: string) { super(m); this.name = 'ConflictError'; } }
export class BadRequestError extends Error { constructor(m: string) { super(m); this.name = 'BadRequestError'; } }

// ─── Stub: resolve FarmerProfile from DB (swap with real Farm+User query) ────

async function resolveFarmerProfile(
  userId:  string,
  farmId:  string,
): Promise<FarmerProfile> {
  // TODO: Replace with actual User + Farm DB query
  // This stub returns a representative profile for development
  return {
    userId,
    state:        'Maharashtra',
    farmSizeHa:   1.5,
    category:     FarmerCategory.SMALL,
    cropTypes:    ['Rice', 'Wheat'],
    waterSources: ['canal', 'rainwater'],
    age:          38,
    gender:       'male',
    annualIncome: 120000,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class SchemeService {

  // ─── GET / ──────────────────────────────────────────────────────────────

  async getSchemes(query: ListSchemesQuery): Promise<PaginatedResult<IScheme>> {
    const { page = 1, limit = 10, category, state, isActive } = query;

    const cacheKey = cache.CACHE_KEYS.schemesList(JSON.stringify({ page, limit, category, state, isActive }));
    const cached   = await cache.get(cacheKey);
    if (cached) return JSON.parse(cached) as PaginatedResult<IScheme>;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const filter: Record<string, any> = {};
    if (category !== undefined) filter.category = category;
    if (state    !== undefined) filter.state     = state;
    if (isActive !== undefined) filter.isActive  = isActive;
    else                        filter.isActive  = true;

    const result = await schemeRepository.findMany(filter, page, limit);

    await cache.set(cacheKey, JSON.stringify(result), cache.CACHE_TTL.SCHEMES_LIST);
    return result;
  }

  // ─── GET /:id ────────────────────────────────────────────────────────────

  async getSchemeById(id: string): Promise<IScheme> {
    const cacheKey = cache.CACHE_KEYS.schemeDetail(id);
    const cached   = await cache.get(cacheKey);
    if (cached) {
      await schemeRepository.incrementView(id); // fire-and-forget
      return JSON.parse(cached) as IScheme;
    }

    const scheme = await schemeRepository.findById(id);
    if (!scheme) throw new NotFoundError('Scheme not found.');

    await Promise.all([
      cache.set(cacheKey, JSON.stringify(scheme), cache.CACHE_TTL.SCHEME_DETAIL),
      schemeRepository.incrementView(id),
    ]);

    return scheme;
  }

  // ─── GET /search ─────────────────────────────────────────────────────────

  async searchSchemes(query: SearchSchemesQuery): Promise<PaginatedResult<IScheme>> {
    const { q, category, page = 1, limit = 10 } = query;

    const cacheKey = cache.CACHE_KEYS.searchResults(JSON.stringify({ q, category, page, limit }));
    const cached   = await cache.get(cacheKey);
    if (cached) return JSON.parse(cached) as PaginatedResult<IScheme>;

    const result = await schemeRepository.search(q ?? '', category, page, limit);

    await cache.set(cacheKey, JSON.stringify(result), cache.CACHE_TTL.SEARCH_RESULTS);
    return result;
  }

  // ─── POST /check-eligibility ─────────────────────────────────────────────

  async checkEligibility(
    input: CheckEligibilityInput,
    user:  AuthUser,
  ): Promise<EligibilityResult> {
    const scheme = await schemeRepository.findById(input.schemeId);
    if (!scheme) throw new NotFoundError('Scheme not found.');

    const profile = await resolveFarmerProfile(user._id, input.farmId);
    return checkEligibility(profile, scheme);
  }

  // ─── POST /apply ─────────────────────────────────────────────────────────

  async applyForScheme(body: ApplyBody, user: AuthUser): Promise<IApplication> {
    const scheme = await schemeRepository.findById(body.schemeId);
    if (!scheme)        throw new NotFoundError('Scheme not found.');
    if (!scheme.isActive) throw new BadRequestError('This scheme is no longer accepting applications.');

    const exists = await applicationRepository.existsByUserAndScheme(user._id, body.schemeId);
    if (exists) throw new ConflictError('You have already applied for this scheme.');

    const application = await applicationRepository.create({
      userId:             new Types.ObjectId(user._id),
      schemeId:           new Types.ObjectId(body.schemeId),
      farmId:             body.farmId ? new Types.ObjectId(body.farmId) : null,
      status:             ApplicationStatus.SUBMITTED,
      submittedDocuments: body.submittedDocuments.map((d) => ({
        ...d,
        mediaId: new Types.ObjectId(d.mediaId),
      })),
      appliedAt: new Date(),
    });

    await schemeRepository.incrementApplicationCount(body.schemeId);

    return application;
  }

  // ─── GET /my-applications ────────────────────────────────────────────────

  async getApplications(
    query: ListApplicationsQuery,
    user:  AuthUser,
  ): Promise<PaginatedResult<IApplication>> {
    const { page = 1, limit = 10, status } = query;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const filter: Record<string, any> = {
      isDeleted: false,
    };

    if (user.role !== UserRole.ADMIN) {
      filter.userId = new Types.ObjectId(user._id);
    }
    if (status) filter.status = status;

    return applicationRepository.findMany(filter, page, limit);
  }

  // ─── GET /applications/:id ───────────────────────────────────────────────

  async getApplicationById(id: string, user: AuthUser): Promise<IApplication> {
    const app = await applicationRepository.findById(id);
    if (!app) throw new NotFoundError('Application not found.');

    const isOwner = app.userId.toString() === user._id;
    if (!isOwner && user.role !== UserRole.ADMIN) {
      throw new ForbiddenError('Access denied.');
    }

    return app;
  }

  // ─── PATCH /applications/:id/status ─────────────────────────────────────

  async updateApplicationStatus(
    id:   string,
    body: UpdateStatusBody,
    user: AuthUser,
  ): Promise<IApplication> {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenError('Only admins can update application status.');
    }

    const app = await applicationRepository.findById(id);
    if (!app) throw new NotFoundError('Application not found.');

    const now = new Date();
    const timestamps: Partial<IApplication> = {};
    if (body.status === ApplicationStatus.APPROVED) timestamps.approvedAt = now;
    if (body.status === ApplicationStatus.REJECTED) timestamps.rejectedAt = now;

    const updated = await applicationRepository.update(id, {
      status:  body.status as IApplication['status'],
      remarks: body.remarks ?? app.remarks,
      ...timestamps,
    });

    if (!updated) throw new NotFoundError('Application not found after update.');
    return updated;
  }

  // ─── POST /sync ──────────────────────────────────────────────────────────

  async syncSchemes(user: AuthUser): Promise<{ upserted: number; modified: number }> {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenError('Only admins can sync schemes.');
    }

    const result = await schemeRepository.upsertMany(MOCK_SCHEMES);

    // Invalidate all scheme caches after sync
    await cache.delByPattern('schemes:*');

    return result;
  }
}

export const schemeService = new SchemeService();
