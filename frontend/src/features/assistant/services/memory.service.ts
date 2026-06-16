import { FarmerMemory, MemoryInsight } from '../types/memory.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';

export const memoryService = {
  async getMemory(farmerId: string): Promise<FarmerMemory> {
    const res = await fetch(`${API_BASE}/memory/${farmerId}`);
    if (!res.ok) throw new Error('Failed to fetch memory');
    return res.json();
  },

  async updateMemory(
    farmerId: string,
    updates: Partial<FarmerMemory>
  ): Promise<FarmerMemory> {
    const res = await fetch(`${API_BASE}/memory/${farmerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update memory');
    return res.json();
  },

  async clearMemory(farmerId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/memory/${farmerId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to clear memory');
  },

  async getInsights(farmerId: string): Promise<MemoryInsight[]> {
    const res = await fetch(`${API_BASE}/memory/${farmerId}/insights`);
    if (!res.ok) throw new Error('Failed to fetch insights');
    return res.json();
  },

  async recordInteraction(farmerId: string, sessionId: string): Promise<void> {
    await fetch(`${API_BASE}/memory/${farmerId}/interactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, timestamp: new Date().toISOString() }),
    });
  },

  getMockMemory(farmerId: string): FarmerMemory {
    return {
      profile: {
        id: farmerId,
        name: 'Ramesh Patil',
        nameLocal: 'रमेश पाटील',
        location: {
          village: 'Sangamner',
          district: 'Ahmednagar',
          state: 'Maharashtra',
          coordinates: { lat: 19.5699, lng: 74.2095 },
        },
        farmSize: 5.5,
        farmSizeUnit: 'acres',
        soilType: 'Black Cotton Soil',
        soilTypeLocal: 'काळी माती',
        preferredLanguage: 'mr',
        experience: 12,
      },
      currentCrop: 'Cotton',
      currentCropLocal: 'कापूस',
      cropHistory: [
        {
          id: '1',
          crop: 'Soybean',
          cropLocal: 'सोयाबीन',
          season: 'kharif',
          year: 2023,
          yield: 12,
          yieldUnit: 'quintals',
          area: 5.5,
          success: true,
        },
        {
          id: '2',
          crop: 'Wheat',
          cropLocal: 'गहू',
          season: 'rabi',
          year: 2023,
          yield: 18,
          yieldUnit: 'quintals',
          area: 3,
          success: true,
        },
      ],
      diseaseHistory: [
        {
          id: '1',
          disease: 'Yellow Mosaic Virus',
          diseaseLocal: 'पिवळे मोझेक',
          crop: 'Soybean',
          detectedAt: new Date('2023-08-15'),
          severity: 'moderate',
          treated: true,
          treatmentUsed: 'Thiamethoxam spray',
          outcome: 'resolved',
        },
      ],
      recommendationHistory: [
        {
          id: '1',
          recommendedCrop: 'Cotton',
          recommendedAt: new Date('2024-03-01'),
          accepted: true,
          outcome: 'In progress',
        },
      ],
      lastInteraction: new Date(),
      totalSessions: 24,
      insights: [
        {
          id: '1',
          type: 'last_crop',
          labelKey: 'memory.lastCrop',
          value: 'Soybean',
          valueLocal: 'सोयाबीन',
          date: new Date('2023-11-01'),
          icon: '🌱',
          color: 'emerald',
        },
        {
          id: '2',
          type: 'previous_disease',
          labelKey: 'memory.previousDisease',
          value: 'Yellow Mosaic',
          valueLocal: 'पिवळे मोझेक',
          date: new Date('2023-08-15'),
          icon: '🦠',
          color: 'amber',
        },
        {
          id: '3',
          type: 'last_recommendation',
          labelKey: 'memory.lastRecommendation',
          value: 'Cotton',
          valueLocal: 'कापूस',
          date: new Date('2024-03-01'),
          icon: '💡',
          color: 'blue',
        },
      ],
    };
  },
};
