import React from 'react';
import { Tabs } from 'expo-router';
import { HomeIcon, GardenIcon } from '../../components/shared/Icons';
import { Colors } from '../../config/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 72,
          backgroundColor: Colors.surface,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 48,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="my-garden"
        options={{
          title: 'My Garden',
          tabBarIcon: ({ color }) => <GardenIcon color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
} 