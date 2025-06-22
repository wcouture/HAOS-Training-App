import { Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Supplements() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Supplements</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
