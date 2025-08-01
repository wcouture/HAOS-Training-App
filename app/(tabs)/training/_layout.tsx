import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function TrainingLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="SubscribedPrograms"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ProgramDetails" options={{ headerShown: false }} />
        <Stack.Screen name="SegmentDetails" options={{ headerShown: false }} />
        <Stack.Screen
          name="ProgramDayDetails"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="CircuitDetails" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
