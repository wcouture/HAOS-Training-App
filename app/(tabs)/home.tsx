import ContentCard from "@/components/ContentCard";
import InfoCard from "@/components/InfoCard";
import { HeaderTitle } from "@react-navigation/elements";
import { router } from "expo-router";
import { Button, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.sectionContainer}>
          <HeaderTitle style={styles.sectionHeader}>
            Upcoming Events
          </HeaderTitle>
          <ScrollView horizontal>
            <InfoCard />
          </ScrollView>
        </View>
        <View style={styles.sectionContainer}>
          <HeaderTitle style={styles.sectionHeader}>Exercise Demos</HeaderTitle>
          <ScrollView horizontal>
            <ContentCard title="power clean" />
          </ScrollView>
        </View>
        <View>
          <Button title="Login" onPress={() => router.replace("/")} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    paddingTop: 20,
    paddingBottom: 20,

    paddingLeft: 10,
    paddingRight: 10,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionHeader: {
    paddingLeft: 20,
    fontSize: 20,
  },
});
