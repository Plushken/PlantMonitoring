import { Alert } from 'react-native';
import { plantStorage } from '../services/plant-storage';

/**
 * Centralized water confirmation handler
 * Eliminates duplicate Alert.alert patterns across screens
 */
export const handleWaterWithConfirmation = async (
  plantId: string,
  onSuccess: () => void,
  onError?: (message: string) => void
) => {
  try {
    const result = await plantStorage.markWateredWithConfirmation(plantId);
    
    if (result.needsConfirmation) {
      Alert.alert(
        'Confirm Watering',
        result.message,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Water Anyway',
            onPress: async () => {
              try {
                const forceResult = await plantStorage.markWateredWithConfirmation(plantId, true);
                if (forceResult.success) {
                  Alert.alert('✅', 'Plant watered!');
                  onSuccess();
                } else {
                  const errorMessage = forceResult.message || 'Failed to mark as watered';
                  Alert.alert('Error', errorMessage);
                  onError?.(errorMessage);
                }
              } catch (error) {
                const errorMessage = 'Failed to mark as watered';
                Alert.alert('Error', errorMessage);
                onError?.(errorMessage);
              }
            }
          }
        ]
      );
    } else if (result.success) {
      Alert.alert('✅', 'Plant watered!');
      onSuccess();
    } else {
      const errorMessage = result.message || 'Failed to mark as watered';
      Alert.alert('Error', errorMessage);
      onError?.(errorMessage);
    }
  } catch (error) {
    const errorMessage = 'Failed to mark as watered';
    Alert.alert('Error', errorMessage);
    onError?.(errorMessage);
  }
};

/**
 * Centralized fertilize confirmation handler
 * Eliminates duplicate Alert.alert patterns across screens
 */
export const handleFertilizeWithConfirmation = async (
  plantId: string,
  onSuccess: () => void,
  onError?: (message: string) => void
) => {
  try {
    const result = await plantStorage.markFertilizedWithConfirmation(plantId);
    
    if (result.needsConfirmation) {
      Alert.alert(
        'Confirm Fertilizing',
        result.message,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Fertilize Anyway',
            onPress: async () => {
              try {
                const forceResult = await plantStorage.markFertilizedWithConfirmation(plantId, true);
                if (forceResult.success) {
                  Alert.alert('✅', 'Plant fertilized!');
                  onSuccess();
                } else {
                  const errorMessage = forceResult.message || 'Failed to mark as fertilized';
                  Alert.alert('Error', errorMessage);
                  onError?.(errorMessage);
                }
              } catch (error) {
                const errorMessage = 'Failed to mark as fertilized';
                Alert.alert('Error', errorMessage);
                onError?.(errorMessage);
              }
            }
          }
        ]
      );
    } else if (result.success) {
      Alert.alert('✅', 'Plant fertilized!');
      onSuccess();
    } else {
      const errorMessage = result.message || 'Failed to mark as fertilized';
      Alert.alert('Error', errorMessage);
      onError?.(errorMessage);
    }
  } catch (error) {
    const errorMessage = 'Failed to mark as fertilized';
    Alert.alert('Error', errorMessage);
    onError?.(errorMessage);
  }
};

/**
 * Simple water handler without confirmation (for tasks screen)
 */
export const handleWaterSimple = async (
  plantId: string,
  onSuccess: () => void,
  onError?: (message: string) => void
) => {
  try {
    await plantStorage.markWatered(plantId);
    Alert.alert('✅', 'Plant watered!');
    onSuccess();
  } catch (error) {
    const errorMessage = 'Failed to mark as watered';
    Alert.alert('Error', errorMessage);
    onError?.(errorMessage);
  }
};

/**
 * Simple fertilize handler without confirmation (for tasks screen)
 */
export const handleFertilizeSimple = async (
  plantId: string,
  onSuccess: () => void,
  onError?: (message: string) => void
) => {
  try {
    await plantStorage.markFertilized(plantId);
    Alert.alert('✅', 'Plant fertilized!');
    onSuccess();
  } catch (error) {
    const errorMessage = 'Failed to mark as fertilized';
    Alert.alert('Error', errorMessage);
    onError?.(errorMessage);
  }
}; 