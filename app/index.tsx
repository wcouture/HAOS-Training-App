import { CheckUserLogin } from "@/services/AccountService";
import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function LandingScreen() {
  useEffect(() => {
    CheckUserLogin(
      () => {
        router.dismissAll;
        router.replace("/home");
      },
      (error) => {
        console.error(error);
      }
    );
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
