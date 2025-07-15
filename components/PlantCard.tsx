import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SavedPlant } from '../services/plant-storage';
import { 
  needsWatering, 
  needsFertilizing, 
  formatDaysSinceWater, 
  formatDaysSinceFertilizer 
} from '../utils/plant-utils';
import { PlantIcon } from '../components/shared/Icons';
import SmallIntensityIndicator from './shared/SmallIntensityIndicator';
import { Colors } from '../config/theme';

interface PlantCardProps {
  plant: SavedPlant;
  onWater: (id: string) => void;
  onFertilize: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPress?: (id: string) => void;
  showEditDelete?: boolean;
  showCareInfo?: boolean;
}

const PlantCard = ({ 
  plant, 
  onWater, 
  onFertilize,
  onEdit,
  onDelete,
  onPress,
  showEditDelete = true,
  showCareInfo = false
}: PlantCardProps) => {
  const needsWater = needsWatering(plant.lastWatered || null, plant.waterLevel);
  const needsFertilizer = needsFertilizing(plant.lastFertilized || null, plant.fertilizerLevel);

  // Display image priority: local image > API image > Wikipedia image > default icon
  const displayImage = plant.imageUri || plant.apiImageUrl || plant.wikipediaImageUrl;

  return (
    <TouchableOpacity 
      style={styles.plantCard}
      onPress={() => onPress?.(plant.id)}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.plantImageContainer}>
        {displayImage ? (
          <Image source={{ uri: displayImage }} style={styles.plantImage} />
        ) : (
          <PlantIcon />
        )}
      </View>
      
      <View style={styles.plantInfo}>
        <Text style={styles.plantName}>{plant.nickname || plant.name}</Text>
        <Text style={styles.plantScientific}>{plant.userId}</Text>
        <Text style={styles.plantLocation}>📍 {plant.location}</Text>
        
        {/* Care indicators with 5-level support */}
        <View style={styles.careIndicators}>
          <View style={styles.careItem}>
            <SmallIntensityIndicator level={plant.sunlightLevel} iconType="light" maxLevel={5} />
            <Text style={styles.careLabel}>Sun</Text>
          </View>
          <View style={styles.careItem}>
            <SmallIntensityIndicator level={plant.waterLevel} iconType="water" maxLevel={5} />
            <Text style={styles.careLabel}>Water</Text>
          </View>
          <View style={styles.careItem}>
            <SmallIntensityIndicator level={plant.fertilizerLevel} iconType="fertilizer" maxLevel={5} />
            <Text style={styles.careLabel}>Fertilizer</Text>
          </View>
        </View>

        {/* Care information for tasks screen */}
        {showCareInfo && (
          <View style={styles.careInfo}>
            {needsWater && (
              <Text style={styles.careText}>
                💧 Needs water ({formatDaysSinceWater(plant.lastWatered || null)})
              </Text>
            )}
            {needsFertilizer && (
              <Text style={styles.careText}>
                🌿 Needs fertilizer ({formatDaysSinceFertilizer(plant.lastFertilized || null)})
              </Text>
            )}
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, needsWater && styles.urgentButton]}
            onPress={() => onWater(plant.id)}
          >
            <Text style={[styles.actionButtonText, needsWater && styles.urgentButtonText]}>
              💧 {needsWater ? 'Water now!' : 'Water'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, needsFertilizer && styles.urgentButton]}
            onPress={() => onFertilize(plant.id)}
          >
            <Text style={[styles.actionButtonText, needsFertilizer && styles.urgentButtonText]}>
              🌱 {needsFertilizer ? 'Fertilize!' : 'Fertilize'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Edit and Delete buttons - only show if enabled */}
        {showEditDelete && onEdit && onDelete && (
          <View style={styles.editDeleteButtons}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => onEdit(plant.id)}
            >
              <Text style={styles.editButtonText}>✏️ Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => onDelete(plant.id)}
            >
              <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  plantCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 48,
    elevation: 4,
  },
  plantImageContainer: {
    width: 100,
    height: 214,
    backgroundColor: Colors.backgroundSecondary,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    resizeMode: 'cover',
  },
  plantIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantIconText: {
    fontSize: 24,
    color: Colors.primary,
  },
  plantInfo: {
    flex: 1,
    padding: 12,
  },
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  plantScientific: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  plantLocation: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 4,
  },
  careIndicators: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  careItem: {
    alignItems: 'center',
  },
  careLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  careInfo: {
    marginTop: 8,
    marginBottom: 4,
  },
  careText: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: '500',
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    height: 32,
    backgroundColor: Colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  urgentButton: {
    backgroundColor: '#FFF3CD',
    borderColor: Colors.warning,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  urgentButtonText: {
    color: '#856404',
    fontWeight: '600',
  },
  editDeleteButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: Colors.warning,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 6,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textOnPrimary,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: Colors.error,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textOnPrimary,
  },
});

export default PlantCard; 