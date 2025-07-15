import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import plantStorage, { SavedPlant } from '../../services/plant-storage';
import PlantCard from '../../components/PlantCard';
import { needsWatering, needsFertilizing } from '../../utils/plant-utils';
import { BackIcon, PlantIcon } from '../../components/shared/Icons';
import { handleWaterWithConfirmation, handleFertilizeWithConfirmation } from '../../utils/care-handlers';
import { navigateToPlantDetails, navigateToEditPlant, navigateToAddPlant } from '../../utils/navigation-utils';
import { Colors } from '../../config/theme';


export default function MyGardenScreen() {
  const router = useRouter();
  const [plants, setPlants] = useState<SavedPlant[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalPlants: 0,
    plantsNeedingWater: 0,
    plantsNeedingFertilizer: 0,
  });

  // Load plants for all users and combine them (or load for specific user)
  const loadPlants = async () => {
    try {
      // Load ALL plants regardless of owner
      const allPlants = await plantStorage.getAllPlants();
      
      // Calculate combined stats
      let totalPlants = allPlants.length;
      let plantsNeedingWater = 0;
      let plantsNeedingFertilizer = 0;
      
      allPlants.forEach(plant => {
        const needsWater = needsWatering(plant.lastWatered || null, plant.waterLevel);
        const needsFertilizer = needsFertilizing(plant.lastFertilized || null, plant.fertilizerLevel);
        
        if (needsWater) plantsNeedingWater++;
        if (needsFertilizer) plantsNeedingFertilizer++;
      });
      
      setPlants(allPlants);
      setStats({
        totalPlants,
        plantsNeedingWater,
        plantsNeedingFertilizer,
      });
    } catch (error) {
      console.error('Error loading plants:', error);
    }
  };

  // Load when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadPlants();
    }, [])
  );

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadPlants();
    setRefreshing(false);
  };

  // Water plant
  const handleWater = (plantId: string) => {
    handleWaterWithConfirmation(plantId, loadPlants);
  };

  // Fertilize plant
  const handleFertilize = (plantId: string) => {
    handleFertilizeWithConfirmation(plantId, loadPlants);
  };

  // Edit plant
  const handleEdit = (plantId: string) => {
    navigateToEditPlant(router, plantId);
  };

  // View plant details
  const handlePlantPress = (plantId: string) => {
    navigateToPlantDetails(router, plantId);
  };

  // Delete plant
  const handleDelete = (plantId: string) => {
    Alert.alert(
      'Delete Plant',
      'Are you sure you want to delete this plant? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await plantStorage.deletePlant(plantId);
              Alert.alert('✅', 'Plant deleted successfully!');
              loadPlants(); // Reload data
            } catch (error) {
              Alert.alert('Error', 'Failed to delete plant');
            }
          },
        },
      ]
    );
  };

  if (plants.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
        <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Garden</Text>
        <View style={{ width: 50 }} />
      </View>
        
        <View style={styles.emptyState}>
          <PlantIcon />
          <Text style={styles.emptyTitle}>No plants yet</Text>
          <Text style={styles.emptySubtitle}>
            Add your first plant to start your garden journey
          </Text>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigateToAddPlant(router)}
          >
            <Text style={styles.addButtonText}>Add a new plant</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Garden</Text>
        <TouchableOpacity 
          style={styles.addIconButton}
          onPress={() => router.push("/add-plant")}
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalPlants}</Text>
          <Text style={styles.statLabel}>Plants</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, stats.plantsNeedingWater > 0 && styles.urgentStat]}>
            {stats.plantsNeedingWater}
          </Text>
          <Text style={styles.statLabel}>Need Water</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, stats.plantsNeedingFertilizer > 0 && styles.urgentStat]}>
            {stats.plantsNeedingFertilizer}
          </Text>
          <Text style={styles.statLabel}>Need Fertilizer</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.plantsContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {plants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onWater={handleWater}
            onFertilize={handleFertilize}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPress={handlePlantPress}
            showEditDelete={true}
            showCareInfo={false}
          />
        ))}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    paddingVertical: 10,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    color: Colors.textPrimary,
  },
  addIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  addButton: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    color: Colors.textOnPrimary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    marginHorizontal: 14,
    marginTop: 14,
    paddingVertical: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 48,
    elevation: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.primary,
  },
  urgentStat: {
    color: '#E53E3E',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  plantsContainer: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  bottomSpacer: {
    height: 20,
  },

}); 