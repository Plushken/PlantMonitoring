import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

/**
 * Shared BackIcon component - used across multiple screens
 */
export const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 12H4M4 12L10 18M4 12L10 6"
      stroke="#2E3333"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Shared CameraIcon component - used for image upload
 */
export const CameraIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
      stroke="#0A5C5C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="13" r="4" stroke="#0A5C5C" strokeWidth="2" />
  </Svg>
);

/**
 * Shared PlantIcon component - used across multiple screens
 */
export const PlantIcon = () => (
  <View style={{
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E9FAFA',
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <Text style={{
      fontSize: 24,
      color: '#0A5C5C',
    }}>🌱</Text>
  </View>
);

/**
 * Shared HomeIcon component for tab navigation
 */
export const HomeIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 10.25V20C3 20.5523 3.44772 21 4 21H8.5C9.05228 21 9.5 20.5523 9.5 20V14C9.5 13.4477 9.94772 13 10.5 13H13.5C14.0523 13 14.5 13.4477 14.5 14V20C14.5 20.5523 14.9477 21 15.5 21H20C20.5523 21 21 20.5523 21 20V10.25C21 9.93524 20.8518 9.63885 20.6 9.45L12.6 3.45C12.2466 3.17467 11.7534 3.17467 11.4 3.45L3.4 9.45C3.14819 9.63885 3 9.93524 3 10.25Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Shared GardenIcon component for tab navigation
 */
export const GardenIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M6.5 8.75C6.5 5.29822 9.29822 2.5 12.75 2.5C16.2018 2.5 19 5.29822 19 8.75C19 11.5127 17.1779 13.8569 14.6618 14.5845C14.2357 14.7154 14 15.1021 14 15.5425V20C14 20.5523 13.5523 21 13 21H12.5C11.9477 21 11.5 20.5523 11.5 20V15.5425C11.5 15.1021 11.2643 14.7154 10.8382 14.5845C8.32208 13.8569 6.5 11.5127 6.5 8.75Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 9.5C9 9.5 10 10.5 12.75 10.5C15.5 10.5 16.5 9.5 16.5 9.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);