import { Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Community() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Community</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
