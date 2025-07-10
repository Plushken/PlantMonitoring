import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface OnboardingIllustrationProps {
  svg: React.FC<SvgProps>;
  alt: string;
}

const OnboardingIllustration: React.FC<OnboardingIllustrationProps> = ({ svg: SvgComponent, alt }) => (
  <View
    accessible
    accessibilityRole="image"
    accessibilityLabel={alt}
    style={styles.container}
  >
    <SvgComponent width="100%" height="100%" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 32,
  },
});

export default OnboardingIllustration; 