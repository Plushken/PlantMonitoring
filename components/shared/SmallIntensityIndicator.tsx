import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { SunIcon, WaterIcon, FertilizerIcon } from '../DynamicIcons';

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
      case 'light': return level <= 2 ? '#FFA726' : level <= 4 ? '#FF8F00' : '#E65100';
      case 'water': return level <= 2 ? '#29e9f6' : level <= 4 ? '#29B6F6' : '#0D47A1';
      case 'fertilizer': return level <= 2 ? '#C8E6C9' : level <= 4 ? '#81C784' : '#4CAF50';
      default: return '#0A5C5C';
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

  const content = (
    <View style={styles.intensityContainer}>
      <View style={styles.intensityIcon}>
        <Svg width="40" height="40" viewBox="0 0 40 40">
          {/* Background circle */}
          <Circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke="#E9FAFA"
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
        <View style={styles.iconOverlay}>
          {getIcon()}
        </View>
      </View>
      <Text style={styles.levelText}>{level}/{maxLevel}</Text>
    </View>
  );

  // Only wrap in TouchableOpacity if onPress is provided
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
});

const styles = StyleSheet.create({
  intensityContainer: {
    alignItems: 'center',
  },
  intensityIcon: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
});

export default SmallIntensityIndicator; 