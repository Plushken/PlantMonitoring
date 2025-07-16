import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';


import * as ImagePicker from 'expo-image-picker';
import { createPermaPeopleAPI, Plant } from '../services/permapeople-api';
import { PERMAPEOPLE_CONFIG, isAPIConfigured } from '../config/api';
import plantStorage from '../services/plant-storage';
import SmallIntensityIndicator from '../components/shared/SmallIntensityIndicator';
import { WikipediaAPI } from '../services/wikipedia-api';
import { Colors } from '../config/theme';

// Debounce utility function
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

import { BackIcon } from '../components/shared/Icons';
import { navigateToMyGarden } from '../utils/navigation-utils';




const AddPlantScreen = () => {
  const router = useRouter();
  const { edit } = useLocalSearchParams();
  const isEditing = !!edit;
  const [selectedUser, setSelectedUser] = useState('');
  const [sunlightLevel, setSunlightLevel] = useState(3);
  const [waterLevel, setWaterLevel] = useState(3);
  const [fertilizerLevel, setFertilizerLevel] = useState(3);
  
  // Form states
  const [plantName, setPlantName] = useState('');
  const [nickname, setNickname] = useState('');
  const [plantType, setPlantType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [searchResults, setSearchResults] = useState<Plant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [apiImageUrl, setApiImageUrl] = useState<string | null>(null);
  const [wikipediaImageUrl, setWikipediaImageUrl] = useState<string | null>(null);
  const [isLoadingWikipediaImage, setIsLoadingWikipediaImage] = useState(false);
  const [shouldFetchWikipediaImage, setShouldFetchWikipediaImage] = useState(false);
  const [isPlantSelected, setIsPlantSelected] = useState(false);
  const [isLoadingForEdit, setIsLoadingForEdit] = useState(false);

  // Debounced plant name for Wikipedia search
  const debouncedPlantName = useDebounce(plantName, 800);
  
  // Debounced plant name for PermaPeople search (shorter delay for better UX)
  const debouncedSearchQuery = useDebounce(plantName, 500);

  // API initialization
  const api = useMemo(() => {
    return isAPIConfigured() ? createPermaPeopleAPI(PERMAPEOPLE_CONFIG.KEY_ID, PERMAPEOPLE_CONFIG.KEY_SECRET) : null;
  }, []);



  // Load plant data when editing
  useEffect(() => {
    if (isEditing && edit) {
      loadPlantForEdit(edit as string);
    }
  }, [isEditing, edit]);

  // Debounced Wikipedia image search
  useEffect(() => {
    if (debouncedPlantName && shouldFetchWikipediaImage && !isLoadingForEdit) {
      fetchWikipediaImage(debouncedPlantName);
    } else if (!debouncedPlantName && !isLoadingForEdit && !isEditing) {
      // Only clear Wikipedia image if we're not editing and not loading
      setWikipediaImageUrl(null);
    }
  }, [debouncedPlantName, shouldFetchWikipediaImage, isLoadingForEdit, isEditing]);

  // Cancel Wikipedia requests on unmount
  useEffect(() => {
    return () => {
      WikipediaAPI.cancelAllRequests();
    };
  }, []);



  const loadPlantForEdit = async (plantId: string) => {
    setIsLoadingForEdit(true);
    try {
      const plant = await plantStorage.getPlant(plantId);
      if (plant) {
        // Mark as plant selected to prevent search from running
        setIsPlantSelected(true);
        
        setPlantName(plant.name);
        setNickname(plant.nickname || '');
        setPlantType(plant.plantType);
        setLocation(plant.location);
        setDescription(plant.description);
        setSunlightLevel(plant.sunlightLevel);
        setWaterLevel(plant.waterLevel);
        setFertilizerLevel(plant.fertilizerLevel);
        setSelectedUser(plant.userId);
        
        // Set images - preserve original images when editing
        if (plant.imageUri) {
          setSelectedImage(plant.imageUri);
        }
        if (plant.apiImageUrl) {
          setApiImageUrl(plant.apiImageUrl);
        }
        if (plant.wikipediaImageUrl) {
          setWikipediaImageUrl(plant.wikipediaImageUrl);
        }
        
        // Don't enable Wikipedia fetching for editing to preserve original images
        setShouldFetchWikipediaImage(false);
      }
    } catch (error) {
      console.error('Error loading plant for edit:', error);
      Alert.alert('Error', 'Failed to load plant data');
    } finally {
      setIsLoadingForEdit(false);
    }
  };

  const handleIntensityPress = useCallback((type: 'sunlight' | 'water' | 'fertilizer') => {
    switch (type) {
      case 'sunlight':
        setSunlightLevel((prev) => (prev === 5 ? 1 : prev + 1));
        break;
      case 'water':
        setWaterLevel((prev) => (prev === 5 ? 1 : prev + 1));
        break;
      case 'fertilizer':
        setFertilizerLevel((prev) => (prev === 5 ? 1 : prev + 1));
        break;
    }
  }, []);

  // Fetch Wikipedia image for plant name
  const fetchWikipediaImage = useCallback(async (plantName: string) => {
    if (!plantName || plantName.length < 2) {
      setWikipediaImageUrl(null);
      return;
    }

    // Get scientific name from selected plant if available
    const scientificName = selectedPlant?.scientific_name;

    setIsLoadingWikipediaImage(true);
    try {
      const imageUrl = await WikipediaAPI.searchPlantImage(plantName, scientificName);
      setWikipediaImageUrl(imageUrl);
    } catch (error) {
      console.error('[Wikipedia] Error fetching image:', error);
      setWikipediaImageUrl(null);
    } finally {
      setIsLoadingWikipediaImage(false);
    }
  }, [selectedPlant]);

  // Plant search with API
  const handlePlantSearch = useCallback(async (query: string) => {
    if (!api || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await api.searchPlants(query);
      setSearchResults(results.plants.slice(0, 5));
    } catch (error) {
      console.error('Plant search error:', error);
      Alert.alert('Search Error', 'Failed to search plants. Please check your internet connection.');
    } finally {
      setIsSearching(false);
    }
  }, [api]);

  // Debounced PermaPeople search
  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.length >= 2 && !isPlantSelected && !isLoadingForEdit) {
      handlePlantSearch(debouncedSearchQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery, handlePlantSearch, isPlantSelected, isLoadingForEdit]);

  // Select plant from search results
  const handlePlantSelect = useCallback((plant: Plant) => {
    setSelectedPlant(plant);
    setPlantName(plant.name);
    setSearchResults([]);
    setIsPlantSelected(true); // Mark that a plant was explicitly selected

    // Auto-set intensity levels based on API data
    if (api) {
      const waterReq = api.getWaterRequirement(plant);
      const lightReq = api.getLightRequirement(plant);
      
      setWaterLevel(api.getWaterIntensityLevel(waterReq));
      setSunlightLevel(api.getLightIntensityLevel(lightReq));
      setFertilizerLevel(api.getFertilizerIntensityLevel(plant));

      // Try to get image URL from API
      const imageUrl = api.getPlantImageUrl(plant);
      if (imageUrl) {
        setApiImageUrl(imageUrl);
      }
    }

    // Enable Wikipedia fetching for the selected plant
    setShouldFetchWikipediaImage(true);
  }, [api]);

  // Handle plant name input change
  const handlePlantNameChange = useCallback((text: string) => {
    setPlantName(text);
    
    // Only reset flags and clear images if we're not currently loading for edit
    if (!isLoadingForEdit) {
      setIsPlantSelected(false); // Reset plant selection flag when user types manually
      // Reset Wikipedia fetch permission while typing
      setShouldFetchWikipediaImage(false);
      // Clear previous results while typing
      setWikipediaImageUrl(null);
    }
  }, [isLoadingForEdit]);

  // Handle plant name field blur (when user finishes typing)
  const handlePlantNameBlur = useCallback(() => {
    if (plantName.trim().length >= 2) {
      setShouldFetchWikipediaImage(true);
    }
  }, [plantName]);

  // Image picker functionality
  const pickImage = useCallback(async () => {
    Alert.alert(
      "Select Image",
      "Choose image source",
      [
        { text: "Camera", onPress: openCamera },
        { text: "Gallery", onPress: openGallery },
        { text: "Cancel", style: "cancel" }
      ]
    );
  }, []);

  const openCamera = useCallback(async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Camera permission is needed to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setApiImageUrl(null); // Clear API image when user selects local image
    }
  }, []);

  const openGallery = useCallback(async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Gallery permission is needed to select photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setApiImageUrl(null); // Clear API image when user selects local image
    }
  }, []);

  // Memoized image display logic
  const finalDisplayImage = useMemo(() => {
    return selectedImage || wikipediaImageUrl || apiImageUrl;
  }, [selectedImage, wikipediaImageUrl, apiImageUrl]);

  // Save plant and navigate to My Garden
  const handleAddPlant = async () => {
    if (!plantName.trim()) {
      Alert.alert('Error', 'Please enter a plant name');
      return;
    }

    if (!selectedUser.trim()) {
      Alert.alert('Error', 'Please enter plant owner name');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Error', 'Please enter plant location');
      return;
    }

    try {
      if (isEditing && edit) {
        // Update existing plant
        const updatedPlant = await plantStorage.updatePlant(edit as string, {
          name: plantName,
          scientificName: selectedPlant?.scientific_name || '',
          nickname: nickname,
          plantType: plantType,
          location: location,
          description: description,
          permaPeopleDescription: selectedPlant?.description || undefined,
          sunlightLevel: sunlightLevel,
          waterLevel: waterLevel,
          fertilizerLevel: fertilizerLevel,
          userId: selectedUser,
          permaPeopleId: selectedPlant?.id,
          imageUri: selectedImage || undefined,
          apiImageUrl: apiImageUrl || undefined,
          wikipediaImageUrl: wikipediaImageUrl || undefined,
        });

        Alert.alert('Success', `Plant "${plantName}" updated successfully!`, [
          { 
            text: 'OK', 
            onPress: () => {
              router.push('/(tabs)/my-garden');
            }
          }
        ]);
      } else {
        // Add new plant
        const savedPlant = await plantStorage.savePlant({
          name: plantName,
          scientificName: selectedPlant?.scientific_name || '',
          nickname: nickname,
          plantType: plantType,
          location: location,
          description: description,
          permaPeopleDescription: selectedPlant?.description || undefined,
          sunlightLevel: sunlightLevel,
          waterLevel: waterLevel,
          fertilizerLevel: fertilizerLevel,
          userId: selectedUser,
          permaPeopleId: selectedPlant?.id,
          imageUri: selectedImage || undefined,
          apiImageUrl: apiImageUrl || undefined,
          wikipediaImageUrl: wikipediaImageUrl || undefined,
        });

        Alert.alert('Success', `Plant "${plantName}" added to your garden!`, [
          { 
            text: 'OK', 
            onPress: () => {
              router.push('/(tabs)/my-garden');
            }
          }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', isEditing ? 'Failed to update plant. Please try again.' : 'Failed to save plant. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Plant' : 'Add a new plant'}</Text>
        <View style={styles.backButton} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image upload section */}
        <View style={styles.imageUpload}>
          <TouchableOpacity onPress={pickImage} style={styles.imagePlaceholder}>
            {finalDisplayImage ? (
              <Image source={{ uri: finalDisplayImage }} style={styles.uploadedImage} />
            ) : isLoadingWikipediaImage ? (
              <>
                <Text style={styles.loadingText}>Loading Wikipedia image...</Text>
              </>
            ) : (
              <>
                <Text style={{ fontSize: 48, color: Colors.primary }}>📷</Text>
                <Text style={styles.uploadText}>Upload or take a photo</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* User name input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Plant Owner *</Text>
          <TextInput
            style={[styles.input, styles.textInput]}
            value={selectedUser}
            onChangeText={setSelectedUser}
            placeholder="Enter owner name..."
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        {/* Intensity indicators section */}
        <View style={styles.intensitySection}>
          <View style={styles.intensityRow}>
            <SmallIntensityIndicator
              level={sunlightLevel}
              onPress={() => handleIntensityPress('sunlight')}
              iconType="light"
            />
            <SmallIntensityIndicator
              level={waterLevel}
              onPress={() => handleIntensityPress('water')}
              iconType="water"
            />
            <SmallIntensityIndicator
              level={fertilizerLevel}
              onPress={() => handleIntensityPress('fertilizer')}
              iconType="fertilizer"
            />
          </View>
        </View>

        {/* PermaPeople Description */}
        {selectedPlant && selectedPlant.description && (
          <View style={styles.permaPeopleDescriptionSection}>
            <Text style={styles.permaPeopleDescriptionTitle}>Plant Information</Text>
            <Text style={styles.permaPeopleDescriptionText}>
              {selectedPlant.description}
            </Text>
            {selectedPlant.scientific_name && (
              <Text style={styles.scientificNameText}>
                Scientific name: {selectedPlant.scientific_name}
              </Text>
            )}
          </View>
        )}

        {/* Default message when no plant selected */}
        {!selectedPlant && (
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionText}>
              Enter plant details below or search for a plant to auto-fill information from our database.
            </Text>
          </View>
        )}

        {/* Form inputs */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Plant name *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={plantName}
                                  onChangeText={handlePlantNameChange}
                  onBlur={handlePlantNameBlur}
                placeholder="Enter or search plant name..."
                placeholderTextColor={Colors.textSecondary}
              />
              {isSearching && (
                <Text style={styles.searchingText}>Searching...</Text>
              )}
            </View>
            
            {/* Search results */}
            {searchResults.length > 0 && (
              <View style={styles.searchResults}>
                {searchResults.map((plant) => (
                  <TouchableOpacity
                    key={plant.id}
                    style={styles.searchResultItem}
                    onPress={() => handlePlantSelect(plant)}
                  >
                    <Text style={styles.searchResultName}>{plant.name}</Text>
                    <Text style={styles.searchResultScientific}>{plant.scientific_name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Plant nickname</Text>
            <TextInput
              style={[styles.input, styles.textInput]}
              value={nickname}
              onChangeText={setNickname}
              placeholder="Enter plant nickname (optional)..."
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Plant type</Text>
            <TextInput
              style={[styles.input, styles.textInput]}
              value={plantType}
              onChangeText={setPlantType}
              placeholder="e.g., Flowering plant, Herb, Tree..."
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={[styles.input, styles.textInput]}
              value={location}
              onChangeText={setLocation}
              placeholder="Where will you keep this plant?"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea, styles.textInput]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add any personal notes about this plant..."
              placeholderTextColor={Colors.textSecondary}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPlant}>
          <Text style={styles.addButtonText}>{isEditing ? 'Update Plant' : 'Add to My Garden'}</Text>
        </TouchableOpacity>
      </View>


    </SafeAreaView>
  );
};

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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  imageUpload: {
    paddingHorizontal: 14,
    paddingVertical: 20,
  },
  imagePlaceholder: {
    height: 240,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
    color: Colors.primary,
    marginTop: 8,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
    color: Colors.primary,
    textAlign: 'center',
  },
  inputSection: {
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  intensitySection: {
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  intensityRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },

  descriptionSection: {
    paddingHorizontal: 28,
    marginBottom: 30,
  },
  descriptionText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.5,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  scientificNameText: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic',
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 8,
  },
  permaPeopleDescriptionSection: {
    paddingHorizontal: 14,
    marginBottom: 24,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 48,
    elevation: 4,
  },
  permaPeopleDescriptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  permaPeopleDescriptionText: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  form: {
    paddingHorizontal: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    height: 48,
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
  inputContainer: {
    position: 'relative',
  },
  textInput: {
    height: 48,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#2E3333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 48,
    elevation: 4,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  searchingText: {
    position: 'absolute',
    right: 16,
    top: 16,
    fontSize: 12,
    color: '#0A5C5C',
  },
  searchResults: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 48,
    elevation: 4,
  },
  searchResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  searchResultScientific: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  footer: {
    padding: 14,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  addButton: {
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  selectedModalItemText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default AddPlantScreen; 