import { UserAccount } from "@/Models/UserAccount";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Profile() {
  const [user, setUser] = useState<UserAccount | null>(null);

  const openHAOSWebsite = async () => {
    await Linking.openURL("https://haostraining.com/pages/programs");
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("user");
    router.replace("/");
  };

  const getUserInfo = async () => {
    const userData = await SecureStore.getItemAsync("user");

    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={stylesheet.container}>
        <View style={stylesheet.PageRow}>
          <Text style={stylesheet.PageTitle}>Member Details</Text>
          <View style={stylesheet.MemberDetailsContainer}>
            <Image
              source={require("@/assets/images/HAOS-logo.png")}
              placeholder={blurhash}
              style={stylesheet.MemberImage}
            />
            <View style={stylesheet.MemberInfoContainer}>
              <Text style={stylesheet.MemberName}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={stylesheet.MemberEmail}>{user?.email}</Text>
            </View>
          </View>
        </View>
        <View style={stylesheet.PageRow}>
          <View style={stylesheet.ProgramList}>
            <Text style={stylesheet.SectionTitle}>Subscribed Programs</Text>
            {user?.subscribedPrograms.map((program) => (
              <Text key={program.id} style={stylesheet.ProgramListItem}>
                - {program.title}
              </Text>
            ))}
            <Pressable
              style={stylesheet.DiscoverLinkButton}
              onPress={openHAOSWebsite}
            >
              <Text style={stylesheet.DiscoverLinkText}>
                Discover More Programs
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={stylesheet.PageRow}>
          <Pressable style={stylesheet.ButtonContainer} onPress={logout}>
            <Text style={stylesheet.ButtonText}>Logout</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const stylesheet = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  PageRow: {
    height: "33%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  PageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    borderBottomColor: "rgba(0,0,0,0.2)",
    borderBottomWidth: 1,
    paddingBottom: 10,
    width: "80%",
    textAlign: "center",
  },

  MemberDetailsContainer: {
    marginTop: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },

  MemberInfoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 10,
  },

  MemberImage: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    backgroundColor: "black",
    padding: 20,
    width: 150,
    height: 150,
  },

  MemberName: {
    fontWeight: "bold",
    fontSize: 20,
  },
  MemberEmail: {
    fontStyle: "italic",
  },

  ProgramList: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: 250,
  },
  SectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    borderBottomColor: "rgba(0,0,0,0.2)",
    borderBottomWidth: 1,
    paddingBottom: 5,
    width: "100%",
    marginBottom: 10,
  },
  ProgramListItem: {
    fontSize: 16,
    textAlign: "left",
  },
  DiscoverLinkButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  DiscoverLinkText: {
    fontSize: 14,
    color: "#C00",
    textDecorationLine: "underline",
  },

  ButtonContainer: {
    width: 80,
    borderWidth: 2,
    borderColor: "#C00",
  },
  ButtonText: {
    textAlign: "center",
    padding: 5,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#C00",
  },
});
