import CircuitList from "@/components/training/CircuitList";
import DayList from "@/components/training/DayList";
import SegmentList from "@/components/training/SegmentList";
import WorkoutList from "@/components/training/WorkoutList";
import {
  Circuit,
  ProgramDay,
  ProgramSegment,
  TrainingProgram,
  Workout,
} from "@/Models/TrainingTypes";
import { UserAccount } from "@/Models/UserAccount";
import { useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { JSX, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ProgramDetails() {
  const localParams = useLocalSearchParams();
  const [programData, setProgramData] = useState<TrainingProgram | null>(null);
  const [headerText, setHeaderText] = useState("");
  const [pageContent, setPageContent] = useState<JSX.Element | null>(null);

  const selectProgramSegment = (segment: ProgramSegment) => {
    setHeaderText(segment?.title as string);
    setPageContent(
      <DayList
        days={segment?.days as ProgramDay[]}
        selectAction={selectProgramDay}
        backAction={() => {}}
      />
    );
  };

  const selectProgramDay = (day: ProgramDay) => {
    setHeaderText(day?.title as string);
    setPageContent(
      <CircuitList
        circuits={day?.circuits as Circuit[]}
        selectAction={selectCircuit}
        backAction={() => {}}
      />
    );
  };

  const selectCircuit = (circuit: Circuit) => {
    setPageContent(
      <WorkoutList
        workouts={circuit?.workouts as Workout[]}
        selectAction={() => {}}
        backAction={() => {}}
        onFullComplete={() => {
          completeCircuit(circuit);
        }}
      />
    );
  };

  const completeCircuit = async (circuit: Circuit) => {
    const userData = await SecureStore.getItemAsync("user");

    let user: UserAccount = {} as UserAccount;
    if (userData) {
      user = JSON.parse(userData as string);
      console.log(JSON.stringify(user));
    }

    if (user?.completedCircuits == null) {
      user.completedCircuits = [];
    }
    if (user?.completedCircuits?.includes(circuit.id)) {
      console.log("Circuit already complete");
      return;
    }
    const response = await fetch(
      `http://localhost:5164/circuits/complete/${user?.id}/${circuit?.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "HAOSAPIauthorizationToken",
        },
      }
    );
    if (response.ok) {
      user?.completedCircuits.push(circuit.id);
      SecureStore.setItemAsync("user", JSON.stringify(user));
      return response.json();
    } else {
      console.log("error");
      console.log(response.status);
      console.log(response.statusText);
      console.log(response.body);
      console.log(JSON.stringify(response));
    }
  };

  const loadProgramData = async (id: number) => {
    fetch("http://localhost:5164/programs/find/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "HAOSAPIauthorizationToken",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Invalid login credentials.");
        }
      })
      .then((data) => {
        setProgramData(data);
        setHeaderText(data.title);
        setPageContent(
          <SegmentList
            selectAction={selectProgramSegment}
            backAction={() => {}}
            segments={data.segments}
          />
        );
      });
  };

  useEffect(() => {
    const programId = parseInt(localParams.id as string);
    loadProgramData(programId);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={stylesheet.container}>
        <View style={stylesheet.HeaderContainer}>
          <Text style={stylesheet.HeaderText}>{headerText}</Text>
        </View>
        {pageContent}
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
});
