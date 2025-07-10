// PermaPeople API Service
// Based on documentation: https://permapeople.org/knowledgebase/api-docs.html

export interface PlantData {
  key: string;
  value: string;
}

export interface Plant {
  id: number;
  type: 'Plant' | 'Variety';
  scientific_name: string;
  name: string;
  version: number;
  description: string;
  link: string;
  parent_id: number | null;
  slug: string;
  updated_at: string;
  created_at: string;
  data: PlantData[];
}

export interface PlantSearchResponse {
  plants: Plant[];
}

export interface ApiError {
  error: string;
  msg: string;
}

// PermaPeople API Request logging


class PermaPeopleAPI {
  private baseURL = 'https://permapeople.org/api';
  private keyId: string;
  private keySecret: string;

  constructor(keyId: string, keySecret: string) {
    this.keyId = keyId;
    this.keySecret = keySecret;
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'x-permapeople-key-id': this.keyId,
      'x-permapeople-key-secret': this.keySecret,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(`API Error: ${error.error} - ${error.msg}`);
    }
    return response.json();
  }

  // Список растений с пагинацией
  async listPlants(lastId?: number, updatedSince?: string): Promise<PlantSearchResponse> {
    const params = new URLSearchParams();
    if (lastId) params.append('last_id', lastId.toString());
    if (updatedSince) params.append('updated_since', updatedSince);
    
    const url = `${this.baseURL}/plants${params.toString() ? '?' + params.toString() : ''}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result = await this.handleResponse<PlantSearchResponse>(response);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Поиск растений по названию
  async searchPlants(query: string): Promise<PlantSearchResponse> {
    const url = `${this.baseURL}/search`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ q: query }),
      });

      const result = await this.handleResponse<PlantSearchResponse>(response);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Получить конкретное растение
  async getPlant(id: number): Promise<Plant> {
    const url = `${this.baseURL}/plants/${id}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result = await this.handleResponse<Plant>(response);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Создать новое растение
  async createPlant(plantData: {
    scientific_name: string;
    name: string;
    note: string;
    type?: 'Plant' | 'Variety';
    parent_id?: number;
  }): Promise<Plant> {
    const url = `${this.baseURL}/plants`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(plantData),
      });

      const result = await this.handleResponse<Plant>(response);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Обновить растение
  async updatePlant(id: number, updates: Partial<Plant> & { note: string; version: number }): Promise<Plant> {
    const url = `${this.baseURL}/plants/${id}`;
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      });

      const result = await this.handleResponse<Plant>(response);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Утилиты для извлечения данных о требованиях растения
  getWaterRequirement(plant: Plant): string | null {
    const waterData = plant.data.find(d => d.key === 'Water requirement');
    return waterData ? waterData.value : null;
  }

  getLightRequirement(plant: Plant): string | null {
    const lightData = plant.data.find(d => d.key === 'Light requirement');
    return lightData ? lightData.value : null;
  }

  // Конвертация требований в уровни интенсивности (1-5)
  getWaterIntensityLevel(waterRequirement: string | null): number {
    if (!waterRequirement) return 3; // default medium
    
    const req = waterRequirement.toLowerCase();
    
    // 5-level water system
    if (req.includes('drought') || req.includes('very dry') || req.includes('minimal')) return 1;
    if (req.includes('dry') || req.includes('low')) return 2;
    if (req.includes('moderate') || req.includes('medium')) return 3;
    if (req.includes('moist') || req.includes('high') || req.includes('wet')) return 4;
    if (req.includes('aquatic') || req.includes('very wet') || req.includes('swamp')) return 5;
    
    return 3; // default medium
  }

  getLightIntensityLevel(lightRequirement: string | null): number {
    if (!lightRequirement) return 3; // default medium
    
    const req = lightRequirement.toLowerCase();
    
    // 5-level light system
    if (req.includes('deep shade') || req.includes('very shade')) return 1;
    if (req.includes('partial shade') || req.includes('shade')) return 2;
    if (req.includes('partial sun') || req.includes('filtered')) return 3;
    if (req.includes('full sun') || req.includes('bright')) return 4;
    if (req.includes('very bright') || req.includes('intense') || req.includes('desert')) return 5;
    
    return 3; // default medium
  }

  // Get fertilizer/soil requirement level (new function)
  getFertilizerIntensityLevel(plant: Plant): number {
    // Look for soil or fertilizer related data
    const soilData = plant.data.find(d => 
      d.key.toLowerCase().includes('soil') || 
      d.key.toLowerCase().includes('fertilizer') ||
      d.key.toLowerCase().includes('nutrition')
    );
    
    if (!soilData) return 3; // default medium
    
    const req = soilData.value.toLowerCase();
    
    // 5-level fertilizer system
    if (req.includes('poor') || req.includes('lean') || req.includes('low')) return 1;
    if (req.includes('light') || req.includes('sandy')) return 2;
    if (req.includes('medium') || req.includes('loam')) return 3;
    if (req.includes('rich') || req.includes('heavy') || req.includes('clay')) return 4;
    if (req.includes('very rich') || req.includes('compost') || req.includes('organic')) return 5;
    
    return 3; // default medium
  }

  // Get plant image URL (if available)
  getPlantImageUrl(plant: Plant): string | null {
    // PermaPeople might have image data in the plant object
    // This would need to be updated based on actual API response structure
    const imageData = plant.data.find(d => 
      d.key.toLowerCase().includes('image') || 
      d.key.toLowerCase().includes('photo')
    );
    
    const imageUrl = imageData ? imageData.value : null;
    return imageUrl;
  }
}

export const createPermaPeopleAPI = (keyId: string, keySecret: string) => {
  return new PermaPeopleAPI(keyId, keySecret);
}; 