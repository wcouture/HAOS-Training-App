import { LoginUser } from "@/services/AccountService";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authenticateUser = async () => {
    LoginUser(email, password, 
      () => {
        router.dismissAll();
        router.replace("/home");
      }, (msg) => {
        console.error(msg);
        alert("Login failed: " + msg);
      });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={stylesheet.PageView}>
        <View style={stylesheet.PageRow}>
          <View style={stylesheet.HeaderSection}>
            <Text style={stylesheet.MainTitle}>Login</Text>
          </View>
        </View>
        <View style={stylesheet.PageRow}>
          <Text style={stylesheet.InputLabel}>Email</Text>
          <TextInput
            style={stylesheet.InputField}
            placeholder="Email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={stylesheet.InputLabel}>Password</Text>
          <TextInput
            style={stylesheet.InputField}
            secureTextEntry
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={stylesheet.PageRow}>
          <Pressable onPress={authenticateUser}>
            <View style={stylesheet.ActionButton}>
              <Text style={stylesheet.ActionButtonText}>Start Training</Text>
            </View>
          </Pressable>
        </View>
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
    display: "flex",
    justifyContent: "center",
    height: "100%",
    width: "75%",
  },

  MainTitle: {
    textAlign: "left",
    width: "100%",
    color: "#9b3232ff",
    fontSize: 48,
    fontStyle: "italic",
    fontWeight: 800,
    paddingLeft: 25,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#9b3232ff"
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
    paddingTop: 0,
    paddingBottom: 50,
  },

  ActionButton: {
    borderWidth: 4,
    borderStyle: "solid",
    borderColor: "#9b3232ff",
    borderRadius: 25,
    maxWidth: "65%",
  },

  ActionButtonText: {
    textAlign: "center",
    color: "#9b3232ff",
    fontWeight: 800,
    fontSize: 30,
    padding: 20,
  },

  InputField: {
    borderWidth: 3,
    borderRadius: 30,
    borderStyle: "solid",
    borderColor: "#9b3232ff",
    width: "65%",
    fontSize: 26,
    padding: 15,
    marginBottom: 50,
  },
  InputLabel: {
    fontSize: 26,
    fontWeight: 400,
    fontStyle: "italic",
    color: "rgba(71, 71, 71, 1)",
    marginBottom: 10,
    width: "65%",
    textAlign: "left",
    borderBottomColor: "rgba(218, 218, 218, 1)",
    borderBottomWidth: 2
  },
});
