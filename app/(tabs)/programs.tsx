import { TrainingProgram } from "@/Models/TrainingProgram";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Programs() {
  const [programs, setPrograms] = useState([] as TrainingProgram[]);

  useEffect(() => {
    fetch("http://localhost:5164/programs/all")
      .then((response) => response.json())
      .then((data) => setPrograms(data));
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Programs</Text>
        <View>
          {programs.map((program) => (
            <Text key={program.id}>{program.title}</Text>
          ))}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
