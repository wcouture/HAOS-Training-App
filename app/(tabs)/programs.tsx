import { TrainingProgram } from "@/Models/TrainingProgram";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Programs() {
  const [programs, setPrograms] = useState([] as TrainingProgram[]);
  const [encryptionKey, setEncryptionKey] = useState("");

  const fetchPrograms = async () => {
    const authToken = "HAOSAPIauthorizationToken";

    fetch("http://localhost:5164/programs/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    })
      .then((response) => response.json())
      .then((data) => setPrograms(data))
      .catch((error) => console.error(error));
  };

  // Retrieve APIs public RSA key
  useEffect(() => {
    fetch("http://localhost:5164/rsa/key")
      .then((response) => response.json())
      .then((key) => {
        fetchPrograms();
      });
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
