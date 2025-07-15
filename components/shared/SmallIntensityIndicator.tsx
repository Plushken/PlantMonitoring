import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { SunIcon, WaterIcon, FertilizerIcon } from '../DynamicIcons';
import { Colors } from '../../config/theme';

interface SmallIntensityIndicatorProps {
  level: number;
  onPress?: () => void;
  iconType: 'light' | 'water' | 'fertilizer';
  maxLevel?: number;
}

// Enhanced intensity indicator with 5 levels (formerly IntensityIndicator)
const SmallIntensityIndicator = React.memo(({ 
  level, 
  onPress, 
  iconType,
  maxLevel = 5
}: SmallIntensityIndicatorProps) => {
  const radius = 16;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (level / maxLevel) * circumference;

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
      <Svg style={styles.progressRing} width="40" height="40">
        {/* Background circle */}
        <Circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke={Colors.border}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <Circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
        />
      </Svg>
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
  },
});

export default SmallIntensityIndicator; 