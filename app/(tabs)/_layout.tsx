import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {FontAwesome, MaterialCommunityIcons, Ionicons} from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {
              backgroundColor: Colors.light.divider,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="car-outline" size={24} color={color} />,
            animation: 'none'
        }}
      />
        <Tabs.Screen
            name="profile"
            options={{
                title: 'Profile',
                tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
            }}
        />
        <Tabs.Screen
            name="safety"
            options={{
                title: 'Safety',
                tabBarIcon: ({ color }) => <Ionicons name="shield-outline" size={24} color={color} />,
            }}
        />
        <Tabs.Screen
            name="payment"
            options={{
                href: null,  // This makes the tab not appear in the tab bar
            }}
        />
        <Tabs.Screen
            name="chatbot"
            options={{
                href: null,  // This makes the tab not appear in the tab bar
            }}
        />
    </Tabs>
  );
}
