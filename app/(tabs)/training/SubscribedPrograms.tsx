import ContentCard from "@/components/ContentCard";
import { TrainingProgram } from "@/Models/TrainingTypes";
import { UserAccount } from "@/Models/UserAccount";
import { GetCurrentUser } from "@/services/AccountService";
import { router, useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
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
    const userData = GetCurrentUser();
    if (userData) {
      setUser(userData);
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
  useFocusEffect(
    React.useCallback(() => {
      fetchUserInfo();
    }, [])
  );

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
          {programs?.map((program, index) => {
            const completed = user.completedPrograms?.includes(program.id);
            return (
              <ContentCard
                index={index}
                key={program.id}
                title={program.title}
                description={program.subtitle}
                checked={completed}
                action={() => openProgramDetails(program)}
              />
            );
          })}
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
    width: "80%",
  },
});
