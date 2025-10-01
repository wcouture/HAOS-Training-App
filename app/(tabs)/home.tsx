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
        <ScrollView style={styles.pageScrollView}>
          <View style={styles.sectionContainer}>
            <HeaderTitle style={styles.sectionHeader}>
              Exercise Demos
            </HeaderTitle>
            <View style={styles.exerciseDemoContainer}>
              {exercises?.map((exercise) => (
                <InfoCard
                  key={exercise.id}
                  title={exercise.name}
                  description={""}
                  embedSource={exercise.demoUrl}
                />
              ))}
            </View>
          </View>
          <View></View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    marginTop: 0,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#fff",
  },
  sectionContainer: {
    marginTop: 10,
  },
  sectionHeader: {
    marginLeft: 10,
    paddingLeft: 10,
    paddingRight: 20,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    borderBottomColor: "rgba(0,0,0,0.3)",
    borderBottomWidth: 1,
    width: "95%",
  },
  pageScrollView: {
    paddingTop: 20,
    flexDirection: "column",
  },
  exerciseDemoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
