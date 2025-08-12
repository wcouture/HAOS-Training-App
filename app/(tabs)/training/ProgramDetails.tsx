import ContentCard from "@/components/ContentCard";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TrainingProgram } from "@/Models/TrainingTypes";
import { UserAccount } from "@/Models/UserAccount";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ProgramDetails() {
  const localParams = useLocalSearchParams();
  const [programData, setProgramData] = useState<TrainingProgram | null>(null);
  const [headerText, setHeaderText] = useState("");
  const [user, setUser] = useState({ id: -1 } as UserAccount);

  const loadProgramData = async (id: number) => {
    fetch("https://haos.willc-dev.net/programs/find/" + id, {
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
      .then((data) => {
        setProgramData(data);
        setHeaderText(data.title);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const programId = parseInt(localParams.id as string);

    SecureStore.getItemAsync("user").then((userData) => {
      if (userData) {
        setUser(JSON.parse(userData));
      }
    });
    loadProgramData(programId);
  }, []);

  useEffect(() => {
    if (user.id == -1) {
      return;
    }

    console.log("Checking is segments complete");

    if (user.completedPrograms?.includes(programData?.id as number)) {
      console.log("Program already completed");
      return;
    }

    console.log(JSON.stringify(user.completedSegments));

    for (let i = 0; i < (programData?.segments.length as number); i++) {
      if (
        !user.completedSegments.includes(programData?.segments[i].id as number)
      ) {
        return;
      }
    }

    fetch(
      "https://haos.willc-dev.net/programs/complete/" +
        user.id +
        "/" +
        programData?.id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "HAOSAPIauthorizationToken",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          user.completedPrograms.push(programData?.id as number);
          SecureStore.setItemAsync("user", JSON.stringify(user));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [programData]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={stylesheet.container}>
        <View style={stylesheet.HeaderContainer}>
          <Pressable
            style={stylesheet.backButton}
            onPress={() => {
              router.back();
            }}
          >
            <IconSymbol size={28} name="chevron.left" color="black" />
          </Pressable>
          <Text style={stylesheet.HeaderText}>{headerText}</Text>
          <View style={stylesheet.SegmentList}>
            {programData?.segments.map((segment, index) => {
              var completed = user?.completedSegments.includes(segment.id);
              return (
                <ContentCard
                  index={index}
                  key={segment.id}
                  title={segment.title}
                  description={segment.subtitle}
                  checked={completed}
                  action={() => {
                    router.push({
                      pathname: "/training/SegmentDetails",
                      params: { id: segment.id },
                    });
                  }}
                />
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const stylesheet = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  HeaderContainer: {
    alignItems: "center",
    borderColor: "black",
    width: "80%",
    marginBottom: 20,
    marginTop: 35,
  },
  HeaderText: {
    fontSize: 28,
    fontWeight: 800,
    textAlign: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.2)",
    paddingBottom: 10,
  },

  SegmentList: {
    width: "100%",
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
  },
});
