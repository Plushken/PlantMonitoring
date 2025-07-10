import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedPlant {
  id: string;
  name: string;
  scientificName: string;
  nickname?: string; // Plant nickname
  plantType: string;
  location: string;
  description: string; // User's personal notes
  permaPeopleDescription?: string; // Description from PermaPeople API
  sunlightLevel: number; // 1-5 scale
  waterLevel: number; // 1-5 scale
  fertilizerLevel: number; // 1-5 scale
  userId: string;
  imageUri?: string; // Local image from phone
  apiImageUrl?: string; // Image URL from PermaPeople API
  wikipediaImageUrl?: string; // Image URL from Wikipedia API
  permaPeopleId?: number;
  createdAt: string;
  lastWatered?: string;
  lastFertilized?: string;
}

const STORAGE_KEY = 'saved_plants';

class PlantStorage {
  // Получить все сохраненные растения
  async getAllPlants(): Promise<SavedPlant[]> {
    try {
      const plantsJson = await AsyncStorage.getItem(STORAGE_KEY);
      return plantsJson ? JSON.parse(plantsJson) : [];
    } catch (error) {
      console.error('Error loading plants:', error);
      return [];
    }
  }

  // Получить растения конкретного пользователя
  async getUserPlants(userId: string): Promise<SavedPlant[]> {
    try {
      const allPlants = await this.getAllPlants();
      return allPlants.filter(plant => plant.userId === userId);
    } catch (error) {
      console.error('Error loading user plants:', error);
      return [];
    }
  }

  // Сохранить новое растение
  async savePlant(plantData: Omit<SavedPlant, 'id' | 'createdAt'>): Promise<SavedPlant> {
    try {
      const allPlants = await this.getAllPlants();
      
      const newPlant: SavedPlant = {
        ...plantData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };

      const updatedPlants = [...allPlants, newPlant];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlants));
      
      return newPlant;
    } catch (error) {
      console.error('Error saving plant:', error);
      throw new Error('Failed to save plant');
    }
  }

  // Обновить растение
  async updatePlant(plantId: string, updates: Partial<SavedPlant>): Promise<SavedPlant | null> {
    try {
      const allPlants = await this.getAllPlants();
      const plantIndex = allPlants.findIndex(plant => plant.id === plantId);
      
      if (plantIndex === -1) {
        throw new Error('Plant not found');
      }

      const updatedPlant = { ...allPlants[plantIndex], ...updates };
      allPlants[plantIndex] = updatedPlant;
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allPlants));
      return updatedPlant;
    } catch (error) {
      console.error('Error updating plant:', error);
      return null;
    }
  }

  // Удалить растение
  async deletePlant(plantId: string): Promise<boolean> {
    try {
      const allPlants = await this.getAllPlants();
      const filteredPlants = allPlants.filter(plant => plant.id !== plantId);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPlants));
      return true;
    } catch (error) {
      console.error('Error deleting plant:', error);
      return false;
    }
  }

  // Получить конкретное растение
  async getPlant(plantId: string): Promise<SavedPlant | null> {
    try {
      const allPlants = await this.getAllPlants();
      return allPlants.find(plant => plant.id === plantId) || null;
    } catch (error) {
      console.error('Error getting plant:', error);
      return null;
    }
  }

  // Отметить полив
  async markWatered(plantId: string): Promise<boolean> {
    try {
      return await this.updatePlant(plantId, {
        lastWatered: new Date().toISOString(),
      }) !== null;
    } catch (error) {
      console.error('Error marking watered:', error);
      return false;
    }
  }

  // Отметить удобрение
  async markFertilized(plantId: string): Promise<boolean> {
    try {
      return await this.updatePlant(plantId, {
        lastFertilized: new Date().toISOString(),
      }) !== null;
    } catch (error) {
      console.error('Error marking fertilized:', error);
      return false;
    }
  }

  // Check if watering more often than interval (returns true if confirmation needed)
  async checkWateringInterval(plantId: string): Promise<{ needsConfirmation: boolean; daysSinceLastWatered: number; intervalDays: number }> {
    try {
      const plant = await this.getPlant(plantId);
      if (!plant) {
        throw new Error('Plant not found');
      }

      if (!plant.lastWatered) {
        return { needsConfirmation: false, daysSinceLastWatered: 999, intervalDays: this.getWateringInterval(plant.waterLevel) };
      }

      const intervalDays = this.getWateringInterval(plant.waterLevel);
      const daysSinceLastWatered = Math.floor((Date.now() - new Date(plant.lastWatered).getTime()) / (1000 * 60 * 60 * 24));

      // If watering more often than interval, confirmation needed
      const needsConfirmation = daysSinceLastWatered < intervalDays;

      return { needsConfirmation, daysSinceLastWatered, intervalDays };
    } catch (error) {
      console.error('Error checking watering interval:', error);
      return { needsConfirmation: false, daysSinceLastWatered: 0, intervalDays: 0 };
    }
  }

  // Check if fertilizing more often than interval (returns true if confirmation needed)
  async checkFertilizingInterval(plantId: string): Promise<{ needsConfirmation: boolean; daysSinceLastFertilized: number; intervalDays: number }> {
    try {
      const plant = await this.getPlant(plantId);
      if (!plant) {
        throw new Error('Plant not found');
      }

      if (!plant.lastFertilized) {
        return { needsConfirmation: false, daysSinceLastFertilized: 999, intervalDays: this.getFertilizingInterval(plant.fertilizerLevel) };
      }

      const intervalDays = this.getFertilizingInterval(plant.fertilizerLevel);
      const daysSinceLastFertilized = Math.floor((Date.now() - new Date(plant.lastFertilized).getTime()) / (1000 * 60 * 60 * 24));

      // If fertilizing more often than interval, confirmation needed
      const needsConfirmation = daysSinceLastFertilized < intervalDays;

      return { needsConfirmation, daysSinceLastFertilized, intervalDays };
    } catch (error) {
      console.error('Error checking fertilizing interval:', error);
      return { needsConfirmation: false, daysSinceLastFertilized: 0, intervalDays: 0 };
    }
  }

  // Mark watered with confirmation check
  async markWateredWithConfirmation(plantId: string, forceUpdate: boolean = false): Promise<{ success: boolean; needsConfirmation: boolean; message?: string }> {
    try {
      const intervalCheck = await this.checkWateringInterval(plantId);
      
      if (intervalCheck.needsConfirmation && !forceUpdate) {
        return {
          success: false,
          needsConfirmation: true,
          message: `You watered this plant ${intervalCheck.daysSinceLastWatered} days ago, but the recommended interval is every ${intervalCheck.intervalDays} days. Are you sure you want to water it again?`
        };
      }

      const success = await this.markWatered(plantId);
      return {
        success,
        needsConfirmation: false,
        message: success ? 'Plant watered successfully!' : 'Failed to mark as watered'
      };
    } catch (error) {
      console.error('Error in markWateredWithConfirmation:', error);
      return { success: false, needsConfirmation: false, message: 'Failed to mark as watered' };
    }
  }

  // Mark fertilized with confirmation check
  async markFertilizedWithConfirmation(plantId: string, forceUpdate: boolean = false): Promise<{ success: boolean; needsConfirmation: boolean; message?: string }> {
    try {
      const intervalCheck = await this.checkFertilizingInterval(plantId);
      
      if (intervalCheck.needsConfirmation && !forceUpdate) {
        return {
          success: false,
          needsConfirmation: true,
          message: `You fertilized this plant ${intervalCheck.daysSinceLastFertilized} days ago, but the recommended interval is every ${intervalCheck.intervalDays} days. Are you sure you want to fertilize it again?`
        };
      }

      const success = await this.markFertilized(plantId);
      return {
        success,
        needsConfirmation: false,
        message: success ? 'Plant fertilized successfully!' : 'Failed to mark as fertilized'
      };
    } catch (error) {
      console.error('Error in markFertilizedWithConfirmation:', error);
      return { success: false, needsConfirmation: false, message: 'Failed to mark as fertilized' };
    }
  }

  // Очистить все данные (для отладки)
  async clearAllPlants(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing plants:', error);
    }
  }

  // Helper functions to calculate intervals based on intensity levels
  private getWateringInterval(waterLevel: number): number {
    const intervals = [7, 5, 4, 2, 1]; // days for levels 1-5
    return intervals[waterLevel - 1] || 3;
  }

  private getFertilizingInterval(fertilizerLevel: number): number {
    const intervals = [14, 10, 7, 5, 3]; // days for levels 1-5
    return intervals[fertilizerLevel - 1] || 7;
  }

  // Статистика
  async getPlantStats(userId: string): Promise<{
    totalPlants: number;
    plantsNeedingWater: number;
    plantsNeedingFertilizer: number;
  }> {
    try {
      const userPlants = await this.getUserPlants(userId);
      const now = new Date();

      const plantsNeedingWater = userPlants.filter(plant => {
        if (!plant.lastWatered) return true;
        const wateringIntervalDays = this.getWateringInterval(plant.waterLevel);
        const lastWatered = new Date(plant.lastWatered);
        const wateringDeadline = new Date(now.getTime() - wateringIntervalDays * 24 * 60 * 60 * 1000);
        return lastWatered < wateringDeadline;
      }).length;

      const plantsNeedingFertilizer = userPlants.filter(plant => {
        if (!plant.lastFertilized) return true;
        const fertilizingIntervalDays = this.getFertilizingInterval(plant.fertilizerLevel);
        const lastFertilized = new Date(plant.lastFertilized);
        const fertilizingDeadline = new Date(now.getTime() - fertilizingIntervalDays * 24 * 60 * 60 * 1000);
        return lastFertilized < fertilizingDeadline;
      }).length;

      return {
        totalPlants: userPlants.length,
        plantsNeedingWater,
        plantsNeedingFertilizer,
      };
    } catch (error) {
      console.error('Error getting plant stats:', error);
      return {
        totalPlants: 0,
        plantsNeedingWater: 0,
        plantsNeedingFertilizer: 0,
      };
    }
  }
}

// Экспорт синглтона
export const plantStorage = new PlantStorage();
export default plantStorage; 