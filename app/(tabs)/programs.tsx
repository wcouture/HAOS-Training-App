import { Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Programs() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Programs</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
