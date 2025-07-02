import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            paddingTop: 10,
            background: "white",
          },
          default: {
            paddingTop: 10,
            background: "white",
          },
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="supplements"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="waterbottle.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="programs"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="dumbbell.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="programDetails"
        options={{
          href: null,
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}
