import React from 'react';
import { View, StyleSheet, ImageStyle } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '../../config/theme';

interface IconProps {
  color?: string;
  size?: number;
  style?: ImageStyle;
}

export const HomeIcon = ({ color = Colors.textSecondary, size = 24, style }: IconProps) => (
  <Image
    source={require('../../assets/icons/home.svg')}
    style={[
      { width: size, height: size },
      color && { tintColor: color },
      style
    ]}
    contentFit="contain"
  />
);

export const GardenIcon = ({ color = Colors.textSecondary, size = 24, style }: IconProps) => (
  <Image
    source={require('../../assets/icons/garden.svg')}
    style={[
      { width: size, height: size },
      color && { tintColor: color },
      style
    ]}
    contentFit="contain"
  />
);

export const BackIcon = ({ color = Colors.textPrimary, size = 24, style }: IconProps) => (
  <Image
    source={require('../../assets/icons/back.svg')}
    style={[
      { width: size, height: size },
      color && { tintColor: color },
      style
    ]}
    contentFit="contain"
  />
);

export const PlantIcon = ({ size = 40 }: { size?: number }) => (
  <View style={[styles.plantIconContainer, { width: size, height: size, borderRadius: size / 2 }]}>
    <Image
      source={require('../../assets/icons/plant.svg')}
      style={{
        width: size * 0.6,
        height: size * 0.6,
        tintColor: Colors.primary
      }}
      contentFit="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  plantIconContainer: {
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});