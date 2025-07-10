/**
 * Plant care utilities - centralized functions for plant care calculations
 */

/**
 * Get watering interval in days based on water level (1-5)
 */
export const getWateringInterval = (waterLevel: number): number => {
  const intervals = [7, 5, 4, 2, 1]; // days for levels 1-5
  return intervals[waterLevel - 1] || 3;
};

/**
 * Get fertilizing interval in days based on fertilizer level (1-5)
 */
export const getFertilizingInterval = (fertilizerLevel: number): number => {
  const intervals = [14, 10, 7, 5, 3]; // days for levels 1-5
  return intervals[fertilizerLevel - 1] || 7;
};

/**
 * Calculate days since last watering
 */
export const getDaysSinceWater = (lastWatered: string | null): number => {
  if (!lastWatered) return 999; // Never watered
  return Math.floor((Date.now() - new Date(lastWatered).getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Calculate days since last fertilizing
 */
export const getDaysSinceFertilizer = (lastFertilized: string | null): number => {
  if (!lastFertilized) return 999; // Never fertilized
  return Math.floor((Date.now() - new Date(lastFertilized).getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Check if plant needs watering
 */
export const needsWatering = (lastWatered: string | null, waterLevel: number): boolean => {
  if (!lastWatered) return true;
  const intervalDays = getWateringInterval(waterLevel);
  return new Date(lastWatered) < new Date(Date.now() - intervalDays * 24 * 60 * 60 * 1000);
};

/**
 * Check if plant needs fertilizing
 */
export const needsFertilizing = (lastFertilized: string | null, fertilizerLevel: number): boolean => {
  if (!lastFertilized) return true;
  const intervalDays = getFertilizingInterval(fertilizerLevel);
  return new Date(lastFertilized) < new Date(Date.now() - intervalDays * 24 * 60 * 60 * 1000);
};

/**
 * Format days since watering for display
 */
export const formatDaysSinceWater = (lastWatered: string | null): string => {
  if (!lastWatered) return 'never watered';
  const days = getDaysSinceWater(lastWatered);
  return `${days} days ago`;
};

/**
 * Format days since fertilizing for display
 */
export const formatDaysSinceFertilizer = (lastFertilized: string | null): string => {
  if (!lastFertilized) return 'never fertilized';
  const days = getDaysSinceFertilizer(lastFertilized);
  return `${days} days ago`;
};

/**
 * Calculate total neglect score for a plant (used for finding most neglected)
 */
export const calculateNeglectScore = (
  lastWatered: string | null,
  lastFertilized: string | null,
  waterLevel: number,
  fertilizerLevel: number
): number => {
  const daysSinceWater = getDaysSinceWater(lastWatered);
  const daysSinceFertilizer = getDaysSinceFertilizer(lastFertilized);
  
  // Only count neglect if plant actually needs care
  const needsWater = needsWatering(lastWatered, waterLevel);
  const needsFertilizer = needsFertilizing(lastFertilized, fertilizerLevel);
  
  return (needsWater ? daysSinceWater : 0) + (needsFertilizer ? daysSinceFertilizer : 0);
}; 