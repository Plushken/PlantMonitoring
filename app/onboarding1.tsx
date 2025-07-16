import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import OnboardingLayout from '../components/OnboardingLayout';
import PrimaryButton from '../components/PrimaryButton';
import { Colors } from '../config/theme';

const Onboarding1Screen: React.FC = () => {
  const router = useRouter();

  return (
    <OnboardingLayout>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel="Illustration of a green paradise with plants."
        style={styles.imageContainer}
      >
        <Image
          source={require('../assets/1.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text
        style={styles.title}
        accessibilityRole="header"
        accessibilityLabel="Welcome to Plant Care App"
      >
        Our plant care app is your reliable assistant in creating a green paradise in your home or office.
      </Text>
      <PrimaryButton
        title="Next"
        onPress={() => router.replace('/onboarding2')}
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

export default Onboarding1Screen; 