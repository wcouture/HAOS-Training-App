import { Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
export default function Register() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Register</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
