import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Code2, Repeat, Map, User } from 'lucide-react-native';
import { colors } from '@/theme/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background.secondary,
          borderTopColor: colors.border.default,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="problems"
        options={{
          title: 'Problems',
          tabBarIcon: ({ color, size }) => <Code2 size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="revision"
        options={{
          title: 'Revision',
          tabBarIcon: ({ color, size }) => <Repeat size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="atlas"
        options={{
          title: 'Atlas',
          tabBarIcon: ({ color, size }) => <Map size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size || 22} color={color} />,
        }}
      />
    </Tabs>
  );
}
