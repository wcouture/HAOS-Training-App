import { router } from "expo-router";
import { useEffect } from "react";
import { Linking } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

export default function Supplements() {
  useEffect(() => {
    const openSupplementsSite = async () => {
      await Linking.openURL("https://bldrsports.com/");
      router.replace("/");
    };
    //openSupplementsSite();
  });
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          style={{ flex: 1 }}
          source={{ uri: "https://bldrsports.com/" }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
