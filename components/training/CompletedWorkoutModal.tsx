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
  const [modalVisible, setModalVisible] = useState(params.isVisible);
  const [workout, setWorkout] = useState<Workout>({} as Workout);
  const [workoutId, setWorkoutId] = useState(0);

  const fetchWorkout = async (workoutId: number) => {
    const response = await fetch(
      "https://haos.willc-dev.net/workouts/find/" + workoutId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "HAOSAPIauthorizationToken",
        },
      }
    );
    if (response.ok) {
      console.log("Workout fetched successfully.");
      setWorkout(await response.json());
      console.log("After setWorkout");
    } else {
      console.log("Error: " + response.status);
    }
  };

  useEffect(() => {
    const wId = params.completedWorkout.workoutId;
    if (wId) {
      setWorkoutId(wId);
    }
  }, [params.isVisible]);

  useEffect(() => {
    if (workoutId > 0) {
      fetchWorkout(workoutId);
    }
  }, [workoutId]);
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
            <>
            <Text style={stylesheet.ModalDataHeader}>
              {"Weight Used"}
            </Text>
            <Text style={stylesheet.ModalDataLabel}>
              {params.completedWorkout.weightUsed}
            </Text>
            </>
            
          ) : (
            <>
            <Text style={stylesheet.ModalDataHeader}>
              {"Time Spent: "}
            </Text>
            <Text style={stylesheet.ModalDataLabel}>
               {Math.floor(params.completedWorkout.duration / 60)} : {String(params.completedWorkout.duration % 60).padStart(2)} s
            </Text>
            </>
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
    height: 400,
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
    fontSize: 18,
    marginLeft: 20,
    marginRight: 20,
  },

  ModalInputSection: {
    marginTop: 25,
    marginBottom: 25,
  },

  ModalDataHeader: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: 800,
  },

  ModalDataLabel: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: 300,
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
