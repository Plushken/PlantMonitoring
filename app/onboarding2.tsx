import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingLayout from '../components/OnboardingLayout';
import PrimaryButton from '../components/PrimaryButton';
import { Colors } from '../config/theme';

const Onboarding2Screen: React.FC = () => {
  const router = useRouter();

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  return (
    <OnboardingLayout>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel="Illustration of plant monitoring and care tips."
        style={styles.imageContainer}
      >
        <Image
          source={require('../assets/2.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text
        style={styles.title}
        accessibilityRole="header"
        accessibilityLabel="Monitor watering levels, get care recommendations, and watch your plants thrive with our tips"
      >
        Monitor watering levels, get care recommendations, and watch your plants thrive with our tips
      </Text>
      <PrimaryButton
        title="Next"
        onPress={handleComplete}
        style={styles.button}
      />
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 32,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 1,
  },
  button: {
    marginTop: 16,
  },
});

export default Onboarding2Screen; 