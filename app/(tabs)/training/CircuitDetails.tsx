import ContentCard from "@/components/ContentCard";
import CompletedWorkoutModal from "@/components/training/CompletedWorkoutModal";
import CompleteWorkoutModal from "@/components/training/CompleteWorkoutModal";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ExerciseType, Workout } from "@/Models/TrainingTypes";
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
  const [selectedCompleteWorkout, setSelectedCompleteWorkout] =
    useState<CompletedWorkout>({} as CompletedWorkout);
  const [modalVisible, setModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);

  const params = useLocalSearchParams();

  const completeWorkout = async (workoutId: number, userInput: number) => {
    var completedWorkout: CompletedWorkout = {
      id: 0,
      workoutId: workoutId,
      userId: user.id,
      completedDate: new Date(),
      weightUsed: 0,
      duration: 0,
    };

    if (selectedWorkout.exercise_.type == ExerciseType.Strength) {
      completedWorkout.weightUsed = userInput;
    } else if (selectedWorkout.exercise_.type == ExerciseType.Endurance) {
      completedWorkout.duration = userInput;
    }

    const response = await fetch(
      "https://haos.willc-dev.net/userworkouts/add?userId=" + user.id,
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
      completedWorkout = (await response.json()) as CompletedWorkout;
      const userData = await SecureStore.getItemAsync("user");

      if (userData) {
        const userObj: UserAccount = JSON.parse(userData);
        userObj.completedWorkouts.push(completedWorkout);
        setUser(userObj);
        await SecureStore.setItemAsync("user", JSON.stringify(userObj));

        var fullComplete = true;
        console.log(JSON.stringify(user.completedWorkouts));
        for (var i = 0; i < workouts.length; i++) {
          console.log(workouts[i].id);
          if (
            !userObj.completedWorkouts.find(
              (x) => x.workoutId == workouts[i].id
            )
          ) {
            fullComplete = false;
            break;
          }
        }
        if (fullComplete) {
          completeCircuit();
        }
      }

      setSelectedWorkout({} as Workout);
      setModalVisible(false);
    }
  };

  const completeCircuit = async () => {
    console.log("Completing Circuit");
    fetch(
      "https://haos.willc-dev.net/circuits/complete/" + user.id + "/" + params.id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "HAOSAPIauthorizationToken",
        },
      }
    ).then((response) => {
      if (response.ok) {
        SecureStore.getItemAsync("user").then((userData) => {
          if (userData) {
            const userObj = JSON.parse(userData);
            userObj.completedCircuits.push(parseInt(params.id as string));
            setUser(userObj);
            SecureStore.setItemAsync("user", JSON.stringify(userObj));
          }
        });
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

    fetch("https://haos.willc-dev.net/circuits/find/" + id, {
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
              const completedWorkoutIndex = user.completedWorkouts?.findIndex(
                (w) => w.workoutId === workout.id
              );
              if (user && completedWorkoutIndex !== -1) {
                completed = true;
              }
              return (
                <ContentCard
                  index={index}
                  key={workout.id}
                  title={workout.exercise_?.name}
                  description={workout.description}
                  action={() => {
                    if (!completed) {
                      setSelectedWorkout(workout);
                      setModalVisible(true);
                    } else {
                      setSelectedCompleteWorkout(
                        user.completedWorkouts[completedWorkoutIndex]
                      );
                      setCompleteModalVisible(true);
                    }
                  }}
                  checked={completed}
                />
              );
            })}
          </View>
        </View>
        <CompleteWorkoutModal
          isVisible={modalVisible}
          setIsVisible={setModalVisible}
          selectedWorkout={selectedWorkout}
          onComplete={completeWorkout}
        />
        <CompletedWorkoutModal
          isVisible={completeModalVisible}
          setIsVisible={setCompleteModalVisible}
          completedWorkout={selectedCompleteWorkout}
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
