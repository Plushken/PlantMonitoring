import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SavedPlant, plantStorage } from '../../services/plant-storage';

import { needsWatering, needsFertilizing, getWateringInterval, getFertilizingInterval } from '../../utils/plant-utils';
import SmallIntensityIndicator from '../../components/shared/SmallIntensityIndicator';
import { BackIcon, PlantIcon } from '../../components/shared/Icons';
import { handleWaterWithConfirmation, handleFertilizeWithConfirmation } from '../../utils/care-handlers';
import { formatDate, getDaysAgo } from '../../utils/date-utils';
import { navigateToEditPlant } from '../../utils/navigation-utils';

export default function AboutScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [plant, setPlant] = useState<SavedPlant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlant();
  }, [id]);

  const loadPlant = async () => {
    try {
      if (id && typeof id === 'string') {
        const plantData = await plantStorage.getPlant(id);
        setPlant(plantData);
      }
    } catch (error) {
      console.error('Error loading plant:', error);
      Alert.alert('Error', 'Failed to load plant information');
    } finally {
      setLoading(false);
    }
  };



  const getNextWateringDate = () => {
    if (!plant?.lastWatered) return 'As soon as possible';
    const interval = getWateringInterval(plant.waterLevel);
    const nextDate = new Date(new Date(plant.lastWatered).getTime() + interval * 24 * 60 * 60 * 1000);
    const now = new Date();
    
    if (nextDate <= now) return 'Now (overdue)';
    
    const daysUntil = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil === 1) return 'Tomorrow';
    return `In ${daysUntil} days`;
  };

  const getNextFertilizingDate = () => {
    if (!plant?.lastFertilized) return 'As soon as possible';
    const interval = getFertilizingInterval(plant.fertilizerLevel);
    const nextDate = new Date(new Date(plant.lastFertilized).getTime() + interval * 24 * 60 * 60 * 1000);
    const now = new Date();
    
    if (nextDate <= now) return 'Now (overdue)';
    
    const daysUntil = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil === 1) return 'Tomorrow';
    return `In ${daysUntil} days`;
  };

  const handleWater = () => {
    if (!plant) return;
    handleWaterWithConfirmation(plant.id, loadPlant);
  };

  const handleFertilize = () => {
    if (!plant) return;
    handleFertilizeWithConfirmation(plant.id, loadPlant);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Plant Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!plant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Plant Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Plant not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const displayImage = plant.imageUri || plant.apiImageUrl || plant.wikipediaImageUrl;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plant Details</Text>
        <TouchableOpacity onPress={() => navigateToEditPlant(router, plant.id)}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Plant Image */}
        <View style={styles.imageContainer}>
          {displayImage ? (
            <Image source={{ uri: displayImage }} style={styles.plantImage} />
          ) : (
            <PlantIcon />
          )}
        </View>

                 {/* Plant Info */}
         <View style={styles.infoSection}>
           <Text style={styles.plantName}>{plant.nickname || plant.name}</Text>
           {plant.nickname && (
             <Text style={styles.originalName}>({plant.name})</Text>
           )}
           {plant.scientificName && (
             <Text style={styles.scientificName}>{plant.scientificName}</Text>
           )}
           <Text style={styles.plantOwner}>Owner: {plant.userId}</Text>
           <Text style={styles.plantLocation}>📍 {plant.location}</Text>
           {plant.plantType && (
             <Text style={styles.plantType}>Type: {plant.plantType}</Text>
           )}
         </View>

         {/* PermaPeople Description */}
         {plant.permaPeopleDescription && (
           <View style={styles.section}>
             <Text style={styles.sectionTitle}>Plant Information</Text>
             <Text style={styles.description}>{plant.permaPeopleDescription}</Text>
           </View>
         )}

         {/* Personal Notes */}
         {plant.description && (
           <View style={styles.section}>
             <Text style={styles.sectionTitle}>Personal Notes</Text>
             <Text style={styles.description}>{plant.description}</Text>
           </View>
         )}

        {/* Care Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care Requirements</Text>
          <View style={styles.careRequirements}>
            <View style={styles.careItem}>
              <SmallIntensityIndicator level={plant.sunlightLevel} iconType="light" />
              <Text style={styles.careLabel}>Sunlight</Text>
              <Text style={styles.careLevel}>Level {plant.sunlightLevel}/5</Text>
            </View>
            <View style={styles.careItem}>
              <SmallIntensityIndicator level={plant.waterLevel} iconType="water" />
              <Text style={styles.careLabel}>Water</Text>
              <Text style={styles.careLevel}>Level {plant.waterLevel}/5</Text>
            </View>
            <View style={styles.careItem}>
              <SmallIntensityIndicator level={plant.fertilizerLevel} iconType="fertilizer" />
              <Text style={styles.careLabel}>Fertilizer</Text>
              <Text style={styles.careLevel}>Level {plant.fertilizerLevel}/5</Text>
            </View>
          </View>
        </View>

        {/* Care History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care History</Text>
          
          <View style={styles.careHistoryItem}>
            <View style={styles.careHistoryHeader}>
              <Text style={styles.careHistoryTitle}>💧 Watering</Text>
              <TouchableOpacity style={styles.actionButton} onPress={handleWater}>
                <Text style={styles.actionButtonText}>Water Now</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.careHistoryDetail}>
              Last watered: {getDaysAgo(plant.lastWatered)}
            </Text>
            <Text style={styles.careHistoryDetail}>
              Next watering: {getNextWateringDate()}
            </Text>
            <Text style={styles.careHistoryDetail}>
              Interval: Every {getWateringInterval(plant.waterLevel)} days
            </Text>
          </View>

          <View style={styles.careHistoryItem}>
            <View style={styles.careHistoryHeader}>
              <Text style={styles.careHistoryTitle}>🌱 Fertilizing</Text>
              <TouchableOpacity style={styles.actionButton} onPress={handleFertilize}>
                <Text style={styles.actionButtonText}>Fertilize Now</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.careHistoryDetail}>
              Last fertilized: {getDaysAgo(plant.lastFertilized)}
            </Text>
            <Text style={styles.careHistoryDetail}>
              Next fertilizing: {getNextFertilizingDate()}
            </Text>
            <Text style={styles.careHistoryDetail}>
              Interval: Every {getFertilizingInterval(plant.fertilizerLevel)} days
            </Text>
          </View>
        </View>

                 {/* Care Tips */}
         <View style={styles.section}>
           <Text style={styles.sectionTitle}>Care Tips</Text>
           <View style={styles.tipContainer}>
             <Text style={styles.tipTitle}>💡 Sunlight ({plant.sunlightLevel}/5)</Text>
             <Text style={styles.tipText}>
               {plant.sunlightLevel <= 2 
                 ? "This plant prefers low to medium light. Keep it away from direct sunlight and place in a spot with indirect light."
                 : plant.sunlightLevel <= 3
                 ? "This plant enjoys medium light conditions. A spot near a window with filtered light is perfect."
                 : plant.sunlightLevel <= 4
                 ? "This plant loves bright light. Place it near a sunny window but protect from harsh afternoon sun."
                 : "This plant thrives in very bright, direct sunlight. A south-facing window or outdoor location is ideal."
               }
             </Text>
           </View>
           
           <View style={styles.tipContainer}>
             <Text style={styles.tipTitle}>💧 Watering ({plant.waterLevel}/5)</Text>
             <Text style={styles.tipText}>
               {plant.waterLevel <= 2 
                 ? "Water sparingly. Allow soil to dry completely between waterings. This plant is drought-tolerant."
                 : plant.waterLevel <= 3
                 ? "Water when the top inch of soil feels dry. Maintain moderate soil moisture."
                 : plant.waterLevel <= 4
                 ? "Keep soil consistently moist but not waterlogged. Water when top layer starts to dry."
                 : "This plant loves frequent watering. Keep soil consistently moist and never let it dry out completely."
               }
             </Text>
           </View>
           
           <View style={styles.tipContainer}>
             <Text style={styles.tipTitle}>🌱 Fertilizing ({plant.fertilizerLevel}/5)</Text>
             <Text style={styles.tipText}>
               {plant.fertilizerLevel <= 2 
                 ? "Minimal fertilizing needed. Feed lightly during growing season with diluted fertilizer."
                 : plant.fertilizerLevel <= 3
                 ? "Moderate feeding required. Fertilize monthly during spring and summer with balanced fertilizer."
                 : plant.fertilizerLevel <= 4
                 ? "Regular feeding promotes healthy growth. Use balanced fertilizer every 2-3 weeks during growing season."
                 : "Heavy feeder that benefits from frequent fertilizing. Feed weekly during growing season with diluted fertilizer."
               }
             </Text>
           </View>
         </View>

        {/* Plant Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plant Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Added:</Text>
            <Text style={styles.detailValue}>{formatDate(plant.createdAt)}</Text>
          </View>
          {plant.scientificName && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Scientific name:</Text>
              <Text style={styles.detailValue}>{plant.scientificName}</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3333',
  },
  editText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0A5C5C',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#899191',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#E53E3E',
  },
  imageContainer: {
    height: 250,
    backgroundColor: '#E9FAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  plantIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantIconText: {
    fontSize: 48,
    color: '#0A5C5C',
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  plantName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E3333',
    marginBottom: 4,
  },
  originalName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#899191',
    marginBottom: 8,
  },
  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#5A6C6C',
    marginBottom: 8,
  },
  plantOwner: {
    fontSize: 16,
    color: '#0A5C5C',
    marginBottom: 4,
  },
  plantLocation: {
    fontSize: 16,
    color: '#0A5C5C',
    marginBottom: 4,
  },
  plantType: {
    fontSize: 16,
    color: '#899191',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3333',
    marginBottom: 16,
  },
  careRequirements: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  careItem: {
    alignItems: 'center',
  },
  careLabel: {
    fontSize: 12,
    color: '#899191',
    marginTop: 8,
    marginBottom: 4,
  },
  careLevel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E3333',
  },
  careHistoryItem: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  careHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  careHistoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3333',
  },
  careHistoryDetail: {
    fontSize: 14,
    color: '#899191',
    marginBottom: 4,
  },
  actionButton: {
    backgroundColor: '#0A5C5C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2E3333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#899191',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#2E3333',
    flex: 2,
    textAlign: 'right',
  },
     bottomSpacer: {
     height: 40,
   },
   tipContainer: {
     marginBottom: 16,
     padding: 12,
     backgroundColor: '#F8F9FA',
     borderRadius: 8,
     borderLeftWidth: 3,
     borderLeftColor: '#0A5C5C',
   },
   tipTitle: {
     fontSize: 16,
     fontWeight: '600',
     color: '#2E3333',
     marginBottom: 8,
   },
   tipText: {
     fontSize: 14,
     lineHeight: 20,
     color: '#5A6C6C',
   },
 }); 