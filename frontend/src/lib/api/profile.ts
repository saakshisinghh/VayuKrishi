// src/lib/api/profile.ts
import { api } from "./axios";

export interface ProfileData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  village: string;
  district: string;
  state: string;
  avatarUrl?: string;
  farm?: {
    location: string;
    sizeAcres: number;
    soilType: string;
    waterSource: string;
    currentCrops: string[];
  };
}

export const fetchProfile = (): Promise<ProfileData> =>
  api.get("/profile").then((r) => r.data);

export const updateProfile = (data: Partial<ProfileData>): Promise<ProfileData> =>
  api.patch("/profile", data).then((r) => r.data);

export const uploadAvatar = (file: File): Promise<{ avatarUrl: string }> => {
  const form = new FormData();
  form.append("avatar", file);
  return api.post("/profile/avatar", form, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
};
