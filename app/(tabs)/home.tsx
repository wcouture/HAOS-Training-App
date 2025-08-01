import InfoCard from "@/components/InfoCard";
import { Exercise, getExerciseTypeString } from "@/Models/TrainingTypes";
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
        <ScrollView>
          <View style={styles.sectionContainer}>
            <HeaderTitle style={styles.sectionHeader}>
              Upcoming Events
            </HeaderTitle>
            <ScrollView horizontal>
              <InfoCard
                title="USA Gym Tour"
                embedSource="https://www.google.com"
              />
            </ScrollView>
          </View>
          <View style={styles.sectionContainer}>
            <HeaderTitle style={styles.sectionHeader}>
              Exercise Demos
            </HeaderTitle>
            <ScrollView horizontal>
              {exercises?.map((exercise) => (
                <InfoCard
                  key={exercise.id}
                  title={exercise.name}
                  description={getExerciseTypeString(exercise.type)}
                  embedSource={exercise.demoUrl}
                />
              ))}
            </ScrollView>
          </View>
          <View></View>
        </ScrollView>
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
