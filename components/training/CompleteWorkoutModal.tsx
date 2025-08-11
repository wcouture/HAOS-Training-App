import { ExerciseType, Workout } from "@/Models/TrainingTypes";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type CompleteWorkoutParams = {
  isVisible: boolean;
  setIsVisible: Function;
  selectedWorkout: Workout;
  onComplete: Function;
};

export default function CompleteWorkoutModal(params: CompleteWorkoutParams) {
  const [inputValue, setInputValue] = React.useState("");
  const [minuteValue, setMinuteValue] = React.useState("");
  const [secondValue, setSecondValue] = React.useState("");

  const generateInputs = () => {
    const exerciseType = params.selectedWorkout?.exercise_?.type;
    if (exerciseType === ExerciseType.Strength) {
      return (
        <View style={stylesheet.ModalInputContainer}>
          <TextInput
            style={stylesheet.WorkoutDataInput}
            value={inputValue}
            onChangeText={setInputValue}
            keyboardType="numeric"
            placeholder="Weight Used"
          />
          <Text>
            lbs
          </Text>
        </View>
      );
    }
    return (<>
        <Text>Time completed in: </Text>
        <View style={stylesheet.ModalInputContainer}>
          <TextInput
            style={stylesheet.WorkoutDataInput}
            value={minuteValue}
            onChangeText={setMinuteValue}
            keyboardType="numeric"
            placeholder="00"
          />
          <Text style={{fontSize: 16, fontWeight: 600}}>:</Text>
          <TextInput
            style={stylesheet.WorkoutDataInput}
            value={secondValue}
            onChangeText={setSecondValue}
            keyboardType="numeric"
            placeholder="00"/>
        </View>
    </>
    
    );
  };

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
        <View style={stylesheet.ModalInputSection}>{generateInputs()}</View>
        <View style={stylesheet.ModalButtonSection}>
          <Pressable
            style={stylesheet.ModalButton}
            onPress={() => {
              var userInput = parseInt(inputValue);
              if (params.selectedWorkout?.exercise_?.type === ExerciseType.Endurance) {
                userInput = parseInt(minuteValue) * 60 + parseInt(secondValue);
              }
              params.onComplete(params.selectedWorkout.id, userInput);
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
    marginLeft: 20,
    marginRight: 20,
  },

  ModalInputSection: {
    marginTop: 25,
    marginBottom: 25,
  },
  ModalInputContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginLeft: "auto",
    marginRight: "auto",
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

  WorkoutDataInput: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    padding: 10,
    fontSize: 22,
    borderRadius: 10,
  },
});
