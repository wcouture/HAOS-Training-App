import ContentCard from "@/components/ContentCard";
import { TrainingProgram } from "@/Models/TrainingTypes";
import { UserAccount } from "@/Models/UserAccount";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Programs() {
  const [programs, setPrograms] = useState([] as TrainingProgram[]);
  const [user, setUser] = useState({ id: -1 } as UserAccount);
  const [encryptionKey, setEncryptionKey] = useState("");

  const fetchPrograms = async () => {
    const authToken = "HAOSAPIauthorizationToken";
    setPrograms(user.subscribedPrograms);
  };

  const fetchUserInfo = async () => {
    const userData = await SecureStore.getItemAsync("user");

    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const openProgramDetails = async (program: TrainingProgram) => {
    router.push({
      pathname: "/(tabs)/training/ProgramDetails",
      params: {
        id: program.id,
      },
    });
  };

  // Retrieve APIs public RSA key
  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (user.id !== -1) {
      fetchPrograms();
    }
  }, [user]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={stylesheets.container}>
        <Text style={stylesheets.ListTitle}>Subscribed Programs</Text>
        <ScrollView style={stylesheets.ProgramList}>
          {programs?.map((program, index) => (
            <ContentCard
              index={index}
              key={program.id}
              title={program.title}
              description={program.subtitle}
              action={() => openProgramDetails(program)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const stylesheets = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  ListTitle: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 30,

    paddingBottom: 10,
    borderBottomColor: "rgba(0,0,0,0.2)",
    borderBottomWidth: 1,
    width: "80%",
  },

  ProgramList: {
    maxHeight: "100%",
    width: "100%",
  },
});
