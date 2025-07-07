import { Workout } from "@/Models/TrainingTypes";
import { CompletedWorkout, UserAccount } from "@/Models/UserAccount";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import ContentCard from "../../components/ContentCard";
import CompletedWorkoutModal from "./CompleteWorkoutModal";

type WorkoutListParams = {
  workouts: Workout[];
  selectAction: Function;
  backAction: Function;
  onFullComplete: Function;
};

export default function WorkoutList(params: WorkoutListParams) {
  const [completedWorkouts, setCompletedWorkouts] = useState<
    CompletedWorkout[]
  >([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout>(
    {} as Workout
  );

  const updateCompletedWorkouts = async (workoutId: number) => {
    const userData = await SecureStore.getItemAsync("user");

    if (userData) {
      const parsedUser: UserAccount = JSON.parse(userData as string);

      const completedWorkout: CompletedWorkout = {
        id: 0,
        workoutId: workoutId,
        userId: parsedUser.id,
      };

      const response = await fetch(
        "http://localhost:5164/userworkouts/add?userId=" + parsedUser.id,
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
        parsedUser.completedWorkouts.push(completedWorkout);

        await SecureStore.setItemAsync("user", JSON.stringify(parsedUser));

        var fullComplete = true;
        for (var i = 0; i < params.workouts.length; i++) {
          if (
            !parsedUser.completedWorkouts.find(
              (cw) => cw.workoutId === params.workouts[i].id
            )
          ) {
            fullComplete = false;
            break;
          }
        }
        if (fullComplete) {
          params.onFullComplete();
        }

        setCompletedWorkouts(parsedUser.completedWorkouts);
      } else {
        console.log("Failed to add completed workout.");
      }
      setSelectedWorkout({} as Workout);
      setModalVisible(false);
    }
  };

  useEffect(() => {
    SecureStore.getItemAsync("user").then((user) => {
      if (user) {
        const parsedUser: UserAccount = JSON.parse(user as string);
        setCompletedWorkouts(parsedUser.completedWorkouts);
      }
    });
  }, []);

  return (
    <View style={stylesheet.container}>
      <View style={stylesheet.dayList}>
        {params.workouts?.map((workout, index) => {
          const completedWorkout = completedWorkouts?.find(
            (cw) => cw.workoutId === workout.id
          );
          const completed = completedWorkout ? true : false;
          return (
            <ContentCard
              key={workout.id}
              title={workout.exercise_?.name}
              description={workout.description}
              action={() => {
                if (!completed) {
                  setSelectedWorkout(workout);
                  setModalVisible(true);
                }
              }}
              checked={completed}
            />
          );
        })}
      </View>

      <CompletedWorkoutModal
        isVisible={modalVisible}
        setIsVisible={setModalVisible}
        selectedWorkout={selectedWorkout}
        onComplete={updateCompletedWorkouts}
      />
    </View>
  );
}

const stylesheet = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },

  dayList: {
    width: "80%",
  },
});
