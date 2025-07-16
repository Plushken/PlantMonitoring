import * as React from 'react';
import { Image } from 'expo-image';
import type { ImageStyle } from 'react-native';

interface DynamicIconProps {
  level: number;
  size?: number;
  color?: string;
  style?: ImageStyle;
}

// Helper functions to get correct SVG source based on level
const getSunSource = (level: number) => {
  switch (level) {
    case 1: return require('../assets/icons/sun-level-1.svg');
    case 2: return require('../assets/icons/sun-level-2.svg');
    case 3: return require('../assets/icons/sun-level-3.svg');
    case 4: return require('../assets/icons/sun-level-4.svg');
    case 5: return require('../assets/icons/sun-level-5.svg');
    default: return require('../assets/icons/sun-base.svg');
  }
};

const getWaterSource = (level: number) => {
  switch (level) {
    case 1: return require('../assets/icons/water-base.svg');
    case 2: return require('../assets/icons/water-level-2.svg');
    case 3: return require('../assets/icons/water-level-3.svg');
    case 4: return require('../assets/icons/water-level-4.svg');
    case 5: return require('../assets/icons/water-level-5.svg');
    default: return require('../assets/icons/water-base.svg');
  }
};

const getFertilizerSource = (level: number) => {
  switch (level) {
    case 1: return require('../assets/icons/fertilizer-base.svg');
    case 2: return require('../assets/icons/fertilizer-level-2.svg');
    case 3: return require('../assets/icons/fertilizer-level-3.svg');
    case 4: return require('../assets/icons/fertilizer-level-4.svg');
    case 5: return require('../assets/icons/fertilizer-level-5.svg');
    default: return require('../assets/icons/fertilizer-base.svg');
  }
};

export const SunIcon: React.FC<DynamicIconProps> = ({ level, size = 24, color, style }) => (
  <Image
    source={getSunSource(level)}
    style={[
      { width: size, height: size },
      color && { tintColor: color },
      style
    ]}
    contentFit="contain"
  />
);

export const WaterIcon: React.FC<DynamicIconProps> = ({ level, size = 24, color, style }) => (
  <Image
    source={getWaterSource(level)}
    style={[
      { width: size, height: size },
      color && { tintColor: color },
      style
    ]}
    contentFit="contain"
  />
);

export const FertilizerIcon: React.FC<DynamicIconProps> = ({ level, size = 24, color, style }) => (
  <Image
    source={getFertilizerSource(level)}
    style={[
      { width: size, height: size },
      color && { tintColor: color },
      style
    ]}
    contentFit="contain"
  />
);

// Get appropriate icon based on requirement type
export const getRequirementIcon = (requirementType: 'light' | 'water' | 'fertilizer', level: number, size?: number) => {
  switch (requirementType) {
    case 'light':
      return <SunIcon level={level} size={size} />;
    case 'water':
      return <WaterIcon level={level} size={size} />;
    case 'fertilizer':
      return <FertilizerIcon level={level} size={size} />;
    default:
      return <SunIcon level={level} size={size} />;
  }
}; 