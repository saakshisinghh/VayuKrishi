import { FilterQuery, Types, UpdateQuery } from "mongoose";
import {
  NotificationModel,
  NotificationDocument,
} from "../notification.model";
import {
  CreateNotificationInput,
  NotificationFilters,
  PaginationParams,
  PaginatedResult,
  NotificationStatus,
} from "../types/notification.types";

/**
 * Repository layer — owns all direct Mongo access for notifications.
 * No business rules live here (e.g. "should this notification be sent"),
 * only persistence concerns. Services orchestrate; repositories fetch/write.
 */
export class NotificationRepository {
  async create(
    input: CreateNotificationInput
  ): Promise<NotificationDocument> {
    return NotificationModel.create({
      ...input,
      userId: new Types.ObjectId(input.userId),
    });
  }

  async createMany(
    inputs: CreateNotificationInput[]
  ): Promise<NotificationDocument[]> {
    if (inputs.length === 0) return [];
    const docs = inputs.map((i) => ({
      ...i,
      userId: new Types.ObjectId(i.userId),
    }));
    const result = await NotificationModel.insertMany(docs, {
      ordered: false,
    });
    return result as unknown as NotificationDocument[];
  }

  async findById(id: string): Promise<NotificationDocument | null> {
    return NotificationModel.findById(id).lean<NotificationDocument>().exec();
  }

  async findByIdAndUser(
    id: string,
    userId: string
  ): Promise<NotificationDocument | null> {
    return NotificationModel.findOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    }).exec();
  }

  async findMany(
    userId: string,
    filters: NotificationFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<NotificationDocument>> {
    const query: FilterQuery<NotificationDocument> = {
      userId: new Types.ObjectId(userId),
    };

    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;

    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      NotificationModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<NotificationDocument[]>()
        .exec(),
      NotificationModel.countDocuments(query),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findUnread(
    userId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResult<NotificationDocument>> {
    const query: FilterQuery<NotificationDocument> = {
      userId: new Types.ObjectId(userId),
      readAt: null,
    };

    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      NotificationModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<NotificationDocument[]>()
        .exec(),
      NotificationModel.countDocuments(query),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async countUnread(userId: string): Promise<number> {
    return NotificationModel.countDocuments({
      userId: new Types.ObjectId(userId),
      readAt: null,
    });
  }

  async update(
    id: string,
    update: UpdateQuery<NotificationDocument>
  ): Promise<NotificationDocument | null> {
    return NotificationModel.findByIdAndUpdate(id, update, {
      new: true,
    }).exec();
  }

  async bulkUpdate(
    filter: FilterQuery<NotificationDocument>,
    update: UpdateQuery<NotificationDocument>
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    const result = await NotificationModel.updateMany(filter, update).exec();
    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  async markAsRead(
    id: string,
    userId: string
  ): Promise<NotificationDocument | null> {
    return NotificationModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(userId) },
      { readAt: new Date(), status: NotificationStatus.READ },
      { new: true }
    ).exec();
  }

  async markAllAsRead(
    userId: string
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    return this.bulkUpdate(
      { userId: new Types.ObjectId(userId), readAt: null },
      { readAt: new Date(), status: NotificationStatus.READ }
    );
  }

  /**
   * Used by notification-dispatch.job.ts to pull a batch of work.
   */
  async findPending(limit: number): Promise<NotificationDocument[]> {
    return NotificationModel.find({ status: NotificationStatus.PENDING })
      .sort({ priority: -1, createdAt: 1 })
      .limit(limit)
      .exec();
  }

  /**
   * Used by notification-dispatch.job.ts to find failed jobs eligible
   * for retry (caller decides eligibility via Redis retry-count tracking).
   */
  async findFailed(limit: number): Promise<NotificationDocument[]> {
    return NotificationModel.find({ status: NotificationStatus.FAILED })
      .sort({ createdAt: 1 })
      .limit(limit)
      .exec();
  }
}

export const notificationRepository = new NotificationRepository();
