import { ExerciseType, Workout } from "@/Models/TrainingTypes";
import { CompletedWorkout } from "@/Models/UserAccount";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type CompletedWorkoutParams = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  completedWorkout: CompletedWorkout;
};

export default function CompletedWorkoutModal(params: CompletedWorkoutParams) {
  const [workout, setWorkout] = useState<Workout>({} as Workout);

  useEffect(() => {
    const workoutId = params.completedWorkout.workoutId;
    const fetchWorkout = async () => {
      const response = await fetch(
        "http://localhost:5164/workouts/find/" + workoutId
      );
      if (response.ok) {
        setWorkout(await response.json());
      }
    };
    fetchWorkout();
  }, []);
  return (
    <Modal
      transparent
      animationType="slide"
      visible={params.isVisible}
      onRequestClose={() => params.setIsVisible(false)}
    >
      <View style={stylesheet.container}>
        <View style={stylesheet.ModalHeaderSection}>
          <Text style={stylesheet.ModalTitleText}>Completed Workout</Text>
          <Text style={stylesheet.ModalExerciseText}>
            {workout?.exercise_?.name}
          </Text>
          <Text style={stylesheet.ModalExerciseText}>
            {workout?.description}
          </Text>
        </View>
        <View style={stylesheet.ModalInputSection}>
          {workout?.exercise_?.type === ExerciseType.Strength ? (
            <Text>{"Weight Used" + params.completedWorkout.weightUsed}</Text>
          ) : (
            <Text>{"Time Spent" + params.completedWorkout.duration}</Text>
          )}
        </View>
        <View style={stylesheet.ModalButtonSection}>
          <Pressable
            style={stylesheet.ModalButton}
            onPress={() => params.setIsVisible(false)}
          >
            <Text style={stylesheet.ModalButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const stylesheet = StyleSheet.create({
  container: {
    marginTop: "auto",
    marginBottom: "auto",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    height: 500,
    backgroundColor: "#FFF",
    borderRadius: 15,
    boxShadow: "1px 1px 5px 1px rgba(0,0,0,0.2)",
  },

  ModalHeaderSection: {
    marginTop: 50,
  },

  ModalTitleText: {
    fontWeight: 800,
    fontSize: 26,
    textAlign: "center",
    marginBottom: 20,
  },

  ModalExerciseText: {
    textAlign: "center",
    fontSize: 16,
  },

  ModalInputSection: {
    marginTop: 25,
    marginBottom: 25,
  },

  ModalButtonSection: {
    marginBottom: 50,
    gap: 10,
  },
  ModalButton: {
    backgroundColor: "#B00",
    padding: 10,
    borderRadius: 10,
  },
  ModalButtonText: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: 800,
  },
});
