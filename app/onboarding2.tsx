import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingLayout from '../components/OnboardingLayout';
import OnboardingIllustration from '../components/OnboardingIllustration';
import PrimaryButton from '../components/PrimaryButton';
import { SvgXml } from 'react-native-svg';
import onboarding2Svg from '../assets/onboarding2-illustration.svg';
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
      <OnboardingIllustration
        svg={onboarding2Svg}
        alt="Illustration of plant monitoring and care tips."
      />
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