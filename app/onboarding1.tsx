import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import OnboardingLayout from '../components/OnboardingLayout';
import OnboardingIllustration from '../components/OnboardingIllustration';
import PrimaryButton from '../components/PrimaryButton';
import { SvgXml } from 'react-native-svg';
import onboarding1Svg from '../assets/onboarding1-illustration.svg';
import { Colors } from '../config/theme';

const Onboarding1Screen: React.FC = () => {
  const router = useRouter();

  return (
    <OnboardingLayout>
      <OnboardingIllustration
        svg={onboarding1Svg}
        alt="Illustration of a green paradise with plants."
      />
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