import { Workout } from "@/Models/TrainingTypes";
import { CompletedWorkout, UserAccount } from "@/Models/UserAccount";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import ContentCard from "../ContentCard";

type WorkoutListParams = {
  workouts: Workout[];
  selectAction: Function;
  backAction: Function;
};

export default function WorkoutList(params: WorkoutListParams) {
  const [completedWorkouts, setCompletedWorkouts] = useState<
    CompletedWorkout[]
  >([]);

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
              action={() => params.selectAction()}
              checked={completed}
            />
          );
        })}
      </View>
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
