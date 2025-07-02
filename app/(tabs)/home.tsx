import InfoCard from "@/components/InfoCard";
import { HeaderTitle } from "@react-navigation/elements";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const loadExerciseData = async () => {
    fetch("http://localhost:5164/exercises/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "HAOSAPIauthorizationToken",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Invalid login credentials.");
        }
      })
      .then((data) => {});
  };

  useEffect(() => {
    loadExerciseData();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.sectionContainer}>
          <HeaderTitle style={styles.sectionHeader}>
            Upcoming Events
          </HeaderTitle>
          <ScrollView horizontal>
            <InfoCard title="USA Gym Tour" />
          </ScrollView>
        </View>
        <View style={styles.sectionContainer}>
          <HeaderTitle style={styles.sectionHeader}>Exercise Demos</HeaderTitle>
          <ScrollView horizontal>
            <InfoCard title="Power Clean" />
          </ScrollView>
        </View>
        <View></View>
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
