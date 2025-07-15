import React from 'react';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '../config/theme';

// Sun icon with different intensities
export const SunIcon = ({ level = 1, size = 24 }: { level: number; size?: number }) => {
  const getColor = () => {
    switch (level) {
      case 1: return Colors.light.level1;
      case 2: return Colors.light.level2;
      case 3: return Colors.light.level3;
      case 4: return Colors.light.level4;
      case 5: return Colors.light.level5;
      default: return Colors.light.level2;
    }
  };

  const getIntensity = () => {
    switch (level) {
      case 1: return 0.4; // Partial shade
      case 2: return 0.6; // Partial sun
      case 3: return 0.8; // Full sun
      case 4: return 0.9; // Intense sun
      case 5: return 1.0; // Very intense
      default: return 0.6;
    }
  };

  const color = getColor();
  const opacity = getIntensity();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="5"
        fill={color}
        opacity={opacity}
      />
      {/* Sun rays */}
      <Path
        d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity={opacity}
      />
    </Svg>
  );
};

// Water drop icon with different intensities  
export const WaterIcon = ({ level = 1, size = 24 }: { level: number; size?: number }) => {
  const getColor = () => {
    switch (level) {
      case 1: return Colors.water.level1;
      case 2: return Colors.water.level2;
      case 3: return Colors.water.level3;
      case 4: return Colors.water.level4;
      case 5: return Colors.water.level5;
      default: return Colors.water.level2;
    }
  };

  const getOpacity = () => {
    return Math.min(0.3 + (level * 0.15), 1.0); // Increase opacity with level
  };

  const color = getColor();
  const opacity = getOpacity();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Main water drop */}
      <Path
        d="M12 2C8 6 5 10 5 14C5 18.4 8.6 22 13 22C17.4 22 21 18.4 21 14C21 10 18 6 12 2Z"
        fill={color}
        opacity={opacity}
      />
      {/* Additional drops for higher levels */}
      {level >= 2 && (
        <Circle cx="8" cy="10" r="1.5" fill={color} opacity={opacity * 0.7} />
      )}
      {level >= 3 && (
        <Circle cx="16" cy="8" r="1" fill={color} opacity={opacity * 0.6} />
      )}
      {level >= 4 && (
        <Circle cx="6" cy="16" r="1" fill={color} opacity={opacity * 0.5} />
      )}
      {level >= 5 && (
        <Circle cx="18" cy="14" r="0.8" fill={color} opacity={opacity * 0.4} />
      )}
    </Svg>
  );
};

// Fertilizer/nutrition icon with different intensities
export const FertilizerIcon = ({ level = 1, size = 24 }: { level: number; size?: number }) => {
  const getColor = () => {
    switch (level) {
      case 1: return Colors.fertilizer.level1;
      case 2: return Colors.fertilizer.level2;
      case 3: return Colors.fertilizer.level3;
      case 4: return Colors.fertilizer.level4;
      case 5: return Colors.fertilizer.level5;
      default: return Colors.fertilizer.level3;
    }
  };

  const getLeafCount = () => {
    return Math.min(level, 5); // Show up to 5 leaves
  };

  const color = getColor();
  const leafCount = getLeafCount();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Main leaf */}
      <Path
        d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 17 8 17 8Z"
        fill={color}
        opacity={leafCount >= 1 ? 1 : 0.3}
      />
      
      {/* Additional leaves for higher levels */}
      {leafCount >= 2 && (
        <Path
          d="M12 2C10 8 8 12 6 16L8 17C10 13 12 8 14 3L12 2Z"
          fill={color}
          opacity={0.8}
        />
      )}
      {leafCount >= 3 && (
        <Path
          d="M19 5C17 7 15 9 13 11L14 12C16 10 18 7 20 5L19 5Z"
          fill={color}
          opacity={0.7}
        />
      )}
      {leafCount >= 4 && (
        <Circle cx="9" cy="9" r="1.5" fill={color} opacity={0.6} />
      )}
      {leafCount >= 5 && (
        <Circle cx="15" cy="15" r="1" fill={color} opacity={0.5} />
      )}
    </Svg>
  );
};

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