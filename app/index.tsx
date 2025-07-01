import { UserAccount } from "@/Models/UserAccount";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function LandingScreen() {
  const updateUserInfo = async (userId: number) => {
    fetch("http://localhost:5164/user/find/" + userId, {
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
    borderWidth: 3,
    borderStyle: "solid",
    borderColor: "#C00",
    maxWidth: "50%",
  },

  ActionButtonText: {
    textAlign: "center",
    color: "#C00",
    fontWeight: 800,
    fontSize: 20,
    padding: 10,
  },
});
