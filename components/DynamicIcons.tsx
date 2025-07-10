import React from 'react';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

// Sun icon with different intensities
export const SunIcon = ({ level = 1, size = 24 }: { level: number; size?: number }) => {
  const getColor = () => {
    switch (level) {
      case 1: return '#FFA726'; // Light orange for partial sun
      case 2: return '#FF9800'; // Medium orange for partial sun/shade
      case 3: return '#FF8F00'; // Deep orange for full sun
      case 4: return '#FF6F00'; // Bright orange for intense sun
      case 5: return '#E65100'; // Deep orange-red for very intense sun
      default: return '#FFB74D';
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

// Water droplet icon with different intensities
export const WaterIcon = ({ level = 1, size = 24 }: { level: number; size?: number }) => {
  const getColor = () => {
    switch (level) {
      case 1: return '#81C784'; // Light green for drought tolerant
      case 2: return '#4FC3F7'; // Light blue for low water
      case 3: return '#29B6F6'; // Medium blue for moderate water
      case 4: return '#1976D2'; // Deep blue for high water
      case 5: return '#0D47A1'; // Very deep blue for aquatic
      default: return '#42A5F5';
    }
  };

  const getDroplets = () => {
    return Math.min(level, 5); // Max 5 droplets
  };

  const color = getColor();
  const droplets = getDroplets();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Main water drop */}
      <Path
        d="M12 2.69L17.5 8.5C18.09 9.19 18.37 10.04 18.37 10.91C18.37 13.22 16.5 15.09 14.19 15.09C11.88 15.09 10.01 13.22 10.01 10.91C10.01 10.04 10.29 9.19 10.88 8.5L12 2.69Z"
        fill={color}
        opacity={droplets >= 1 ? 1 : 0.3}
      />
      
      {/* Additional smaller drops for higher levels */}
      {droplets >= 2 && (
        <Circle cx="7" cy="18" r="2" fill={color} opacity={0.8} />
      )}
      {droplets >= 3 && (
        <Circle cx="17" cy="18" r="1.5" fill={color} opacity={0.7} />
      )}
      {droplets >= 4 && (
        <Circle cx="4" cy="14" r="1" fill={color} opacity={0.6} />
      )}
      {droplets >= 5 && (
        <Circle cx="20" cy="14" r="1" fill={color} opacity={0.5} />
      )}
    </Svg>
  );
};

// Fertilizer/nutrition icon with different intensities
export const FertilizerIcon = ({ level = 1, size = 24 }: { level: number; size?: number }) => {
  const getColor = () => {
    switch (level) {
      case 1: return '#C8E6C9'; // Very light green for minimal fertilizer
      case 2: return '#A5D6A7'; // Light green for low fertilizer
      case 3: return '#81C784'; // Medium green for moderate fertilizer
      case 4: return '#66BB6A'; // Darker green for high fertilizer
      case 5: return '#4CAF50'; // Deep green for intensive fertilizer
      default: return '#81C784';
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