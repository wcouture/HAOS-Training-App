import { Circuit } from "@/Models/TrainingTypes";
import { UserAccount } from "@/Models/UserAccount";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ContentCard from "../ContentCard";

type CircuitListParams = {
  circuits: Circuit[];
  selectAction: Function;
  backAction: Function;
};

export default function CircuitList(params: CircuitListParams) {
  const [completedCircuits, setCompletedCircuits] = useState<number[]>([]);

  useEffect(() => {
    const getCompletedCircuits = async () => {
      const userData = await SecureStore.getItemAsync("user");

      if (userData) {
        const parsedUser: UserAccount = JSON.parse(userData as string);
        console.log(parsedUser.completedCircuits);
        setCompletedCircuits(parsedUser.completedCircuits);
      }
    };
    getCompletedCircuits();
  }, []);
  return (
    <View style={stylesheet.container}>
      <View style={stylesheet.dayList}>
        <Pressable onPress={() => params.backAction()}>
          <Text>Back</Text>
        </Pressable>
        {params.circuits?.map((circuit, index) => {
          var circuitComplete = false;
          if (completedCircuits?.includes(circuit.id)) {
            circuitComplete = true;
          }
          return (
            <ContentCard
              key={circuit.id}
              title={"P" + (index + 1)}
              description={circuit.description}
              action={() => params.selectAction(circuit)}
              checked={circuitComplete}
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
