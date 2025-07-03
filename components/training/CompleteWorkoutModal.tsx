import { Workout } from "@/Models/TrainingTypes";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type CompleteWorkoutParams = {
  isVisible: boolean;
  setIsVisible: Function;
  selectedWorkout: Workout;
  onComplete: Function;
};

export default function CompletedWorkoutModal(params: CompleteWorkoutParams) {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={params.isVisible}
      onRequestClose={() => params.setIsVisible(false)}
    >
      <View style={stylesheet.container}>
        <View style={stylesheet.ModalHeaderSection}>
          <Text style={stylesheet.ModalTitleText}>Complete Workout?</Text>
          <Text style={stylesheet.ModalExerciseText}>
            {params.selectedWorkout?.exercise_?.name}
          </Text>
          <Text style={stylesheet.ModalExerciseText}>
            {params.selectedWorkout?.description}
          </Text>
        </View>
        <View style={stylesheet.ModalButtonSection}>
          <Pressable
            style={stylesheet.ModalButton}
            onPress={() => {
              params.onComplete(params.selectedWorkout.id);
              params.setIsVisible(false);
            }}
          >
            <Text style={stylesheet.ModalButtonText}>Complete</Text>
          </Pressable>
          <Pressable
            style={stylesheet.ModalButton}
            onPress={() => params.setIsVisible(false)}
          >
            <Text style={stylesheet.ModalButtonText}>Cancel</Text>
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
