import ContentCard from "@/components/ContentCard";
import CompletedWorkoutModal from "@/components/training/CompleteWorkoutModal";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Workout } from "@/Models/TrainingTypes";
import { CompletedWorkout, UserAccount } from "@/Models/UserAccount";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function CircuitDetails() {
  const [workouts, setWorkouts] = useState<Workout[]>([] as Workout[]);
  const [headerText, setHeaderText] = useState("");
  const [user, setUser] = useState({ id: -1 } as UserAccount);

  const [selectedWorkout, setSelectedWorkout] = useState<Workout>(
    {} as Workout
  );
  const [modalVisible, setModalVisible] = useState(false);

  const params = useLocalSearchParams();

  const completeWorkout = async (workoutId: number) => {
    const completedWorkout: CompletedWorkout = {
      id: 0,
      workoutId: workoutId,
      userId: user.id,
    };

    const response = await fetch(
      "http://localhost:5164/userworkouts/add?userId=" + user.id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "HAOSAPIauthorizationToken",
        },
        body: JSON.stringify(completedWorkout),
      }
    );

    if (response.ok) {
      completedWorkout.id = (await response.json()).id;
      user.completedWorkouts.push(completedWorkout);

      await SecureStore.setItemAsync("user", JSON.stringify(user));

      var fullComplete = true;
      for (var i = 0; i < params.workouts.length; i++) {
        if (
          !user.completedWorkouts.find((cw) => cw.workoutId === workouts[i]?.id)
        ) {
          fullComplete = false;
          break;
        }
      }
      if (fullComplete) {
        completeCircuit();
      }
      setSelectedWorkout({} as Workout);
      setModalVisible(false);
    }
  };

  const completeCircuit = async () => {
    fetch(
      "http://localhost:5164/circuits/complete/" + user.id + "/" + params.id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "HAOSAPIauthorizationToken",
        },
      }
    ).then((response) => {
      if (response.ok) {
        user.completedCircuits.push(parseInt(params.id as string));
        SecureStore.setItemAsync("user", JSON.stringify(user));
        router.back();
      }
    });
  };

  useEffect(() => {
    const id = params.id;
    const index = parseInt(params.index as string);

    SecureStore.getItemAsync("user").then((userData) => {
      if (userData) {
        setUser(JSON.parse(userData));
      }
    });

    fetch("http://localhost:5164/circuits/find/" + id, {
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
        setHeaderText("P" + (index + 1));
        setWorkouts(data.workouts);
        console.log(JSON.stringify(data.workouts));
      });
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={stylesheet.container}>
        <View style={stylesheet.HeaderContainer}>
          <Pressable
            style={stylesheet.backButton}
            onPress={() => {
              router.back();
            }}
          >
            <IconSymbol size={28} name="chevron.left" color="black" />
          </Pressable>
          <Text style={stylesheet.HeaderText}>{headerText}</Text>
          <View style={stylesheet.workoutList}>
            {workouts?.map((workout, index) => {
              var completed = false;
              if (
                user &&
                user.completedWorkouts.findIndex(
                  (w) => w.workoutId === workout.id
                ) !== -1
              ) {
                completed = true;
              }
              return (
                <ContentCard
                  key={workout.id}
                  title={workout.exercise_?.name}
                  description={workout.description}
                  action={() => {
                    if (completed) {
                      setSelectedWorkout(workout);
                      setModalVisible(true);
                    }
                  }}
                  checked={completed}
                />
              );
            })}
          </View>
        </View>
        <CompletedWorkoutModal
          isVisible={modalVisible}
          setIsVisible={setModalVisible}
          selectedWorkout={selectedWorkout}
          onComplete={completeWorkout}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const stylesheet = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  HeaderContainer: {
    alignItems: "center",
    borderColor: "black",
    width: "80%",
    marginBottom: 20,
    marginTop: 20,
  },
  HeaderText: {
    fontSize: 28,
    fontWeight: 800,
    textAlign: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.2)",
    paddingBottom: 10,
  },

  workoutList: {
    width: "100%",
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
  },
});
