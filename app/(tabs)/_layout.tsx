import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dungeon',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="door.right.hand.open" color={color} />,
        }}
      />
      <Tabs.Screen
        name="altar"
        options={{
          title: 'Altar',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="table.furniture.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="sparkle.magnifyingglass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="treasure"
        options={{
          title: 'Treasure',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="wand.and.rays" color={color} />,
        }}
      />
    </Tabs>
  );
}
