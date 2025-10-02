import InfoCard from "@/components/InfoCard";
import { Exercise } from "@/Models/TrainingTypes";
import { HeaderTitle } from "@react-navigation/elements";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [exercises, setExercises] = useState([] as Exercise[]);
  const loadExerciseData = async () => {
    fetch("https://haos.willc-dev.net/exercises/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "HAOSAPIauthorizationToken",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Invalid login credentials.");
        }
      })
      .then((data) => {
        setExercises(data);
      });
  };

  useEffect(() => {
    loadExerciseData();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaView}>
          <View style={styles.sectionContainer}>
            <HeaderTitle style={styles.sectionHeader}>
              Exercise Demos
            </HeaderTitle>
            <ScrollView style={styles.pageScrollView}>
            <View style={styles.exerciseDemoContainer}>
              {exercises?.map((exercise) => {
                if (!exercise.showDemo) {
                  return null;
                }

                return (
                <InfoCard
                  key={exercise.id}
                  title={exercise.name}
                  description={""}
                  embedSource={exercise.demoUrl}
                />)
              })}
            </View>
            </ScrollView>
          </View>
          <View></View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    marginTop: 0,
    backgroundColor: "rgba(170, 11, 11, 1)",
  },
  sectionContainer: {
    marginTop: 10,
  },
  sectionHeader: {
    paddingBottom: 15,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    borderBottomColor: "rgba(136, 12, 12, 1)",
    color: "#fff",
    borderBottomWidth: 2,
    width: "100%",
  },
  pageScrollView: {
    backgroundColor: "#fff",
    paddingTop: 20,
    flexDirection: "column",
    boxShadow: "1px 1px 5px 5px rgba(0, 0, 0, 0.2) inset",
  },
  exerciseDemoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
