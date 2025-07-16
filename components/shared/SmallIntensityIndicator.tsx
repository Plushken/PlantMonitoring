import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { SunIcon, WaterIcon, FertilizerIcon } from '../DynamicIcons';
import { Colors } from '../../config/theme';

interface SmallIntensityIndicatorProps {
  level: number;
  onPress?: () => void;
  iconType: 'light' | 'water' | 'fertilizer';
  maxLevel?: number;
}

// Helper function to get progress ring source based on level
const getProgressRingSource = (level: number, maxLevel: number = 5) => {
  const progress = Math.min(Math.max(level / maxLevel, 0), 1);
  
  if (progress === 0) return require('../../assets/icons/progress-ring-base.svg');
  if (progress <= 0.2) return require('../../assets/icons/progress-ring-20.svg');
  if (progress <= 0.4) return require('../../assets/icons/progress-ring-40.svg');
  if (progress <= 0.6) return require('../../assets/icons/progress-ring-60.svg');
  if (progress <= 0.8) return require('../../assets/icons/progress-ring-80.svg');
  return require('../../assets/icons/progress-ring-100.svg');
};

// Enhanced intensity indicator with 5 levels (formerly IntensityIndicator)
const SmallIntensityIndicator = React.memo(({ 
  level, 
  onPress, 
  iconType,
  maxLevel = 5
}: SmallIntensityIndicatorProps) => {
  const getColor = () => {
    switch (iconType) {
      case 'light': 
        if (level <= 2) return Colors.light.level1;
        if (level <= 4) return Colors.light.level3;
        return Colors.light.level5;
      case 'water': 
        if (level <= 2) return Colors.water.level1;
        if (level <= 4) return Colors.water.level3;
        return Colors.water.level5;
      case 'fertilizer': 
        if (level <= 2) return Colors.fertilizer.level1;
        if (level <= 4) return Colors.fertilizer.level3;
        return Colors.fertilizer.level5;
      default: return Colors.primary;
    }
  };

  const color = getColor();

  const getIcon = () => {
    switch (iconType) {
      case 'light': return <SunIcon level={level} size={24} />;
      case 'water': return <WaterIcon level={level} size={24} />;
      case 'fertilizer': return <FertilizerIcon level={level} size={24} />;
      default: return <SunIcon level={level} size={24} />;
    }
  };

  const handlePress = () => {
    if (onPress) onPress();
  };

  const content = (
    <View style={styles.iconContainer}>
      {getIcon()}
      <View style={styles.progressRing}>
        {/* Progress ring with filling effect */}
        <Image
          source={getProgressRingSource(level, maxLevel)}
          style={[
            { width: 40, height: 40 },
            { tintColor: color }
          ]}
          contentFit="contain"
        />
      </View>
    </View>
  );

  // Only use TouchableOpacity when editing (onPress provided)
  if (onPress) {
    return (
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        {content}
      </TouchableOpacity>
    );
  }

  // Use View for read-only display
  return (
    <View style={styles.container}>
      {content}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
  },
});

export default SmallIntensityIndicator; 