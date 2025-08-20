import { UserAccount } from "@/Models/UserAccount";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function LandingScreen() {
  const updateUserInfo = async (userId: number) => {
    fetch("https://haos.willc-dev.net/user/find/" + userId, {
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
      .then((data: UserAccount) => {
        if (data.completedPrograms == undefined) data.completedPrograms = [];
        if (data.completedSegments == undefined) data.completedSegments = [];
        if (data.completedDays == undefined) data.completedDays = [];
        if (data.completedCircuits == undefined) data.completedCircuits = [];
        if (data.completedWorkouts == undefined) data.completedWorkouts = [];
        SecureStore.setItemAsync("user", JSON.stringify(data));
      });
  };

  const checkUserAuthentication = async () => {
    const user = await SecureStore.getItemAsync("user");
    if (user) {
      await updateUserInfo(JSON.parse(user).id);
      router.dismissAll;
      router.replace("/home");
    }
  };

  useEffect(() => {
    checkUserAuthentication();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={stylesheet.PageView}>
        <View style={stylesheet.PageRow}>
          <View style={stylesheet.HeaderSection}>
            <Text style={stylesheet.MainTitle}>HAOS</Text>
            <Text style={stylesheet.SubTitle}>Your #1 Training Team</Text>
            <Text style={stylesheet.SubText}>
              For anybody and any race. HAOS is teh academy for high performers.
            </Text>
          </View>
        </View>
        <View style={stylesheet.PageRow}>
          <View style={stylesheet.ActionsContainer}>
            <Pressable
              onPress={() => {
                router.push("/register");
              }}
            >
              <View style={stylesheet.ActionButton}>
                <Text style={stylesheet.ActionButtonText}>JOIN THE TEAM</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                router.push("/login");
              }}
            >
              <View style={stylesheet.ActionButton}>
                <Text style={stylesheet.ActionButtonText}>
                  EXISTING MEMBERS
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={stylesheet.PageRow}></View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const stylesheet = StyleSheet.create({
  PageView: {
    flex: 1,
    backgroundColor: "#fff",
  },

  PageRow: {
    height: "33%",
    justifyContent: "center",
    alignItems: "center",
  },

  HeaderSection: {
    maxWidth: "65%",
  },

  MainTitle: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 10,
  },
  SubTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  SubText: {
    textAlign: "center",
    fontSize: 14,
  },

  ActionsContainer: {
    alignItems: "center",
    gap: 20,
    paddingTop: 50,
    paddingBottom: 50,
  },

  ActionButton: {
    borderWidth: 2,
    borderRadius: 5,
    borderStyle: "solid",
    borderColor: "#444",
    backgroundColor: "#fff",
    maxWidth: "50%",
  },

  ActionButtonText: {
    textAlign: "center",
    color: "#444",
    fontWeight: 400,
    fontSize: 20,
    padding: 5,
  },
});
