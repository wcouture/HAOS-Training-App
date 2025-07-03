import DayList from "@/components/training/DayList";
import SegmentList from "@/components/training/SegmentList";
import {
  ProgramDay,
  ProgramSegment,
  TrainingProgram,
} from "@/Models/TrainingTypes";
import { useLocalSearchParams } from "expo-router";
import { JSX, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function ProgramDetails() {
  const localParams = useLocalSearchParams();
  const [programData, setProgramData] = useState<TrainingProgram | null>(null);
  const [headerText, setHeaderText] = useState("");
  const [pageContent, setPageContent] = useState<JSX.Element | null>(null);

  const selectProgramSegment = (segment: ProgramSegment) => {
    console.log("segmentId: " + segment?.id);
    console.log("selecting segment: " + segment?.title);
    setHeaderText(segment?.title as string);
    setPageContent(
      <DayList
        days={segment?.days as ProgramDay[]}
        selectAction={() => {}}
        backAction={() => {}}
      />
    );
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
