import { UserAccount, UserType } from "@/Models/UserAccount";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authenticateUser = async () => {
    const user: UserAccount = {
      id: 0,
      userType: UserType.User,
      firstName: "",
      lastName: "",
      email: email,
      password: password,
    };

    const payload = JSON.stringify(user);

    fetch("http://localhost:5164/user/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "HAOSAPIauthorizationToken",
      },
      body: payload,
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
        router.dismissAll();
        router.replace("/home");
      });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={stylesheet.PageView}>
        <View style={stylesheet.PageRow}>
          <Text style={stylesheet.MainTitle}>Login</Text>
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

  InputField: {
    borderWidth: 2,
    borderRadius: 10,
    borderStyle: "solid",
    borderColor: "#B00",
    width: "50%",
    fontSize: 20,
    padding: 10,
    marginBottom: 50,
  },
  InputLabel: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 5,
    width: "50%",
    textAlign: "left",
  },
});
