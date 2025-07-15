import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SavedPlant } from '../services/plant-storage';
import { plantStorage } from '../services/plant-storage';
import PlantCard from '../components/PlantCard';

import { needsWatering, needsFertilizing, getWateringInterval, getFertilizingInterval } from '../utils/plant-utils';
import { BackIcon } from '../components/shared/Icons';
import { handleWaterWithConfirmation, handleFertilizeWithConfirmation } from '../utils/care-handlers';
import { navigateToPlantDetails, navigateToAddPlant } from '../utils/navigation-utils';
import { Colors } from '../config/theme';

export default function TasksScreen() {
  const router = useRouter();
  const [tasksPlants, setTasksPlants] = useState<SavedPlant[]>([]);
  const [allPlants, setAllPlants] = useState<SavedPlant[]>([]);

  const loadTasksPlants = async () => {
    try {
      const allPlantsData = await plantStorage.getAllPlants();
      setAllPlants(allPlantsData);
      
      // Filter plants that need care
      const plantsNeedingCare = allPlantsData.filter(plant => {
              const needsWater = needsWatering(plant.lastWatered || null, plant.waterLevel);
      const needsFertilizer = needsFertilizing(plant.lastFertilized || null, plant.fertilizerLevel);
      
      return needsWater || needsFertilizer;
      });

      setTasksPlants(plantsNeedingCare);
    } catch (error) {
      console.error('Error loading tasks plants:', error);
    }
  };

  useEffect(() => {
    loadTasksPlants();
  }, []);

  // Water plant
  const handleWater = (plantId: string) => {
    handleWaterWithConfirmation(plantId, loadTasksPlants);
  };

  // Fertilize plant
  const handleFertilize = (plantId: string) => {
    handleFertilizeWithConfirmation(plantId, loadTasksPlants);
  };

  // View plant details
  const handlePlantPress = (plantId: string) => {
    navigateToPlantDetails(router, plantId);
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
        <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plant Care Tasks</Text>
        <View style={{ width: 50 }} />
      </View>

      {allPlants.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>🌱 No plants yet!</Text>
          <Text style={styles.emptySubtitle}>
            Add your first plant to start tracking care tasks
          </Text>
          <TouchableOpacity 
            style={styles.addPlantButton} 
            onPress={() => navigateToAddPlant(router)}
          >
            <Text style={styles.addPlantButtonText}>Add Your First Plant</Text>
          </TouchableOpacity>
        </View>
      ) : tasksPlants.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>🎉 All plants are happy!</Text>
          <Text style={styles.emptySubtitle}>
            No plants need watering or fertilizing right now
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.plantsContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>
            {tasksPlants.length} plant{tasksPlants.length !== 1 ? 's' : ''} need{tasksPlants.length === 1 ? 's' : ''} your attention
          </Text>
          
          {tasksPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onWater={handleWater}
              onFertilize={handleFertilize}
              onPress={handlePlantPress}
              showEditDelete={false}
              showCareInfo={true}
            />
          ))}
          
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  addPlantButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addPlantButtonText: {
    color: Colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  plantsContainer: {
    flex: 1,
    paddingHorizontal: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginVertical: 16,
  },

  bottomSpacer: {
    height: 100,
  },
}); 