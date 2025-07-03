import { Circuit } from "@/Models/TrainingTypes";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import ContentCard from "../ContentCard";

type CircuitListParams = {
  circuits: Circuit[];
  selectAction: Function;
  backAction: Function;
};

export default function CircuitList(params: CircuitListParams) {
  useEffect(() => {}, []);
  return (
    <View style={stylesheet.container}>
      <View style={stylesheet.dayList}>
        {params.circuits?.map((circuit, index) => {
          return (
            <ContentCard
              key={circuit.id}
              title={"P" + (index + 1)}
              description={circuit.description}
              action={() => params.selectAction(circuit)}
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
