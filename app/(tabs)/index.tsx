import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { getRandomArticles, Article } from '../../data/articles';
import { SavedPlant, plantStorage } from '../../services/plant-storage';
import PlantCard from '../../components/PlantCard';
import { 
  getWateringInterval, 
  getFertilizingInterval, 
  needsWatering, 
  needsFertilizing, 
  getDaysSinceWater, 
  getDaysSinceFertilizer, 
  calculateNeglectScore 
} from '../../utils/plant-utils';

import { handleWaterWithConfirmation, handleFertilizeWithConfirmation } from '../../utils/care-handlers';
import { navigateToPlantDetails, navigateToTasks, navigateToArticles, navigateToArticle, navigateToAddPlant } from '../../utils/navigation-utils';
import { Colors } from '../../config/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [mostNeglectedPlant, setMostNeglectedPlant] = useState<SavedPlant | null>(null);
  const [careMessage, setCareMessage] = useState<string>('');

  // First render only (articles stay same during session)
  useEffect(() => {
    setFeaturedArticles(getRandomArticles(3));
  }, []);

  // Every time screen comes into focus (plants update)
  useFocusEffect(
    React.useCallback(() => {
      findMostNeglectedPlant();
    }, [])
  );

  const findMostNeglectedPlant = async () => {
    try {
      const allPlants: SavedPlant[] = await plantStorage.getAllPlants();
      
      if (allPlants.length === 0) {
        setMostNeglectedPlant(null);
        setCareMessage('NO_PLANTS'); // Special flag to indicate no plants
        return;
      }

      let mostNeglected: SavedPlant | null = null;
      let maxNeglectDays = 0;

             for (const plant of allPlants) {
         const needsWater = needsWatering(plant.lastWatered || null, plant.waterLevel);
         const needsFertilizer = needsFertilizing(plant.lastFertilized || null, plant.fertilizerLevel);

         if (needsWater || needsFertilizer) {
           const neglectScore = calculateNeglectScore(
             plant.lastWatered || null,
             plant.lastFertilized || null,
             plant.waterLevel,
             plant.fertilizerLevel
           );
           
           if (neglectScore > maxNeglectDays) {
             maxNeglectDays = neglectScore;
             mostNeglected = plant;
           }
         }
       }

      if (mostNeglected) {
        setMostNeglectedPlant(mostNeglected);
        
        // Create care message
        const needsWater = needsWatering(mostNeglected.lastWatered || null, mostNeglected.waterLevel);
        const needsFertilizer = needsFertilizing(mostNeglected.lastFertilized || null, mostNeglected.fertilizerLevel);

        let message = `${mostNeglected.name} (${mostNeglected.userId}) at ${mostNeglected.location} needs `;
        
        if (needsWater && needsFertilizer) {
          message += 'watering and fertilizing';
        } else if (needsWater) {
          message += 'watering';
        } else if (needsFertilizer) {
          message += 'fertilizing';
        }
        
        setCareMessage(message);
      } else {
        setMostNeglectedPlant(null);
        setCareMessage('All plants are well cared for! 🌿');
      }
    } catch (error) {
      console.error('Error finding most neglected plant:', error);
    }
  };

  // Handlers for PlantCard
  const handleWater = (plantId: string) => {
    handleWaterWithConfirmation(plantId, findMostNeglectedPlant);
  };

  const handleFertilize = (plantId: string) => {
    handleFertilizeWithConfirmation(plantId, findMostNeglectedPlant);
  };

  // View plant details
  const handlePlantPress = (plantId: string) => {
    navigateToPlantDetails(router, plantId);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>What's up,</Text>
          <Text style={styles.nameText}>Gardener?</Text>
        </View>

        <View style={styles.whatsUpSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Green Blog</Text>
            <TouchableOpacity onPress={() => navigateToArticles(router)}>
              <Text style={styles.sectionAction}>More news</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.articlesScroll}>
            {featuredArticles.map((article) => (
              <TouchableOpacity 
                key={article.id}
                style={styles.whatsUpCard}
                onPress={() => navigateToArticle(router, article.id)}
              >
                <Image source={article.imageUrl} style={styles.whatsUpImage} />
                <View style={styles.whatsUpOverlay}>
                  <Text style={styles.whatsUpTitle}>{article.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Don't Forget to:</Text>
            <TouchableOpacity onPress={() => navigateToTasks(router)}>
              <Text style={styles.sectionAction}>More Tasks</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionDescription}>
            {careMessage === 'NO_PLANTS' 
              ? 'Start your plant journey by adding your first plant!' 
              : (careMessage || 'Keep your plants healthy with regular care and attention.')
            }
          </Text>
          
          {mostNeglectedPlant ? (
            <View style={styles.plantCardContainer}>
              <PlantCard
                plant={mostNeglectedPlant}
                onWater={handleWater}
                onFertilize={handleFertilize}
                onPress={handlePlantPress}
                showEditDelete={false}
                showCareInfo={true}
              />
            </View>
          ) : careMessage === 'NO_PLANTS' ? (
            <View style={styles.taskCard}>
              <View style={styles.taskImageContainer}>
                <View style={styles.taskPlaceholderImage}>
                  <Text style={styles.taskPlaceholderText}>🌱</Text>
                </View>
              </View>
              <View style={styles.taskContent}>
                <View style={styles.taskTextContainer}>
                  <Text style={styles.taskTitle}>No plants yet!</Text>
                  <Text style={styles.taskSubtitle}>Add your first plant</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.taskCard}>
              <View style={styles.taskImageContainer}>
                <View style={styles.taskPlaceholderImage}>
                  <Text style={styles.taskPlaceholderText}>🎉</Text>
                </View>
              </View>
              <View style={styles.taskContent}>
                <View style={styles.taskTextContainer}>
                  <Text style={styles.taskTitle}>Great Job!</Text>
                  <Text style={styles.taskSubtitle}>All plants happy!</Text>
                </View>
              </View>
            </View>
          )}
        </View>
        <TouchableOpacity 
        style={styles.addPlantButton}
                    onPress={() => navigateToAddPlant(router)}
      >
        <Text style={styles.addPlantButtonText}>Add a new plant</Text>
      </TouchableOpacity>
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
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 4,
  },
  whatsUpSection: {
    paddingHorizontal: 14,
    marginTop: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1,
    color: Colors.textPrimary,
  },
  sectionAction: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 1,
    color: Colors.textPrimary,
  },
  articlesScroll: {
    marginLeft: -14,
    paddingLeft: 14,
  },
  whatsUpCard: {
    width: 151,
    height: 173,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  whatsUpImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backgroundSecondary,
  },
  whatsUpOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 20,
    justifyContent: 'flex-end',
  },
  whatsUpTitle: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
    color: Colors.textOnPrimary,
    textAlign: 'center',
  },
  tasksSection: {
    paddingHorizontal: 14,
    marginTop: 30,
  },
  plantCardContainer: {
    marginTop: 20,
  },
  sectionDescription: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 1,
    color: Colors.textSecondary,
    marginTop: 8,
    lineHeight: 22,
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginTop: 20,
    height: 124,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 48,
    elevation: 4,
  },
  taskImageContainer: {
    width: 124,
    height: 124,
    backgroundColor: Colors.backgroundSecondary,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  taskContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  taskTextContainer: {
    marginBottom: 16,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
    color: Colors.textPrimary,
  },
  taskSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 1,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  taskImages: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  taskImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  taskImageMiddle: {
    marginHorizontal: 13,
  },
  taskImageSpacer: {
    width: 10, // Adjust as needed for spacing between indicators
  },
  taskCardImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  taskPlaceholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E9FAFA',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  taskPlaceholderText: {
    fontSize: 50,
  },
  addPlantButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 14,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 4,
  },
  addPlantButtonText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    color: Colors.textOnPrimary,
  },
  newsSection: {
    paddingLeft: 14,
    marginTop: 30,
    marginBottom: 30,
  },
  newsCard: {
    width: 130,
    height: 151,
    marginRight: 16,
    backgroundColor: Colors.surface,
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
  newsImageContainer: {
    height: 111,
    backgroundColor: Colors.backgroundSecondary,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  newsTitle: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 12,
  },
}); 