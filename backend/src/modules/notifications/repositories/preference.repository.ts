import { Types } from "mongoose";
import { PreferenceModel, PreferenceDocument } from "../preference.model";
import { UpdatePreferencesInput } from "../types/notification.types";

export class PreferenceRepository {
  /**
   * Preferences are created lazily on first access so we don't need a
   * signup-time hook in the Users module — this module stays decoupled.
   */
  async findOrCreate(userId: string): Promise<PreferenceDocument> {
    const existing = await PreferenceModel.findOne({
      userId: new Types.ObjectId(userId),
    }).exec();

    if (existing) return existing;

    return PreferenceModel.create({ userId: new Types.ObjectId(userId) });
  }

  async update(
    userId: string,
    update: UpdatePreferencesInput
  ): Promise<PreferenceDocument> {
    const updated = await PreferenceModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $set: update },
      { new: true, upsert: true }
    ).exec();

    return updated;
  }

  /**
   * Used by background jobs to find every user who opted in to a given
   * alert category, e.g. all users with marketAlerts: true.
   */
  async findUsersWithPreferenceEnabled(
    field: keyof UpdatePreferencesInput
  ): Promise<Types.ObjectId[]> {
    const docs = await PreferenceModel.find({ [field]: true })
      .select("userId")
      .lean<{ userId: Types.ObjectId }[]>()
      .exec();

    return docs.map((d) => d.userId);
  }
}

export const preferenceRepository = new PreferenceRepository();
