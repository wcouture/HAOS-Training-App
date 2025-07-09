import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

export default function Community() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          style={{ flex: 1 }}
          source={{ uri: "https://www.facebook.com/share/g/1F3i1VTd64/" }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
