import ContentCard from "@/components/ContentCard";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ProgramDay } from "@/Models/TrainingTypes";
import { UserAccount } from "@/Models/UserAccount";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function SegmentDetails() {
  const [programDays, setProgramDays] = useState<ProgramDay[]>([]);
  const [headerText, setHeaderText] = useState("");
  const [user, setUser] = useState({ id: -1 } as UserAccount);

  const params = useLocalSearchParams();

  useFocusEffect(
    useCallback(() => {
      const segmentId = params.id;

      SecureStore.getItemAsync("user").then((userData) => {
        if (userData) {
          setUser(JSON.parse(userData));
        }
      });

      fetch("https://haos.willc-dev.net/segments/find/" + segmentId, {
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
          setProgramDays(data.days);
          setHeaderText(data.title);
        })
        .catch((error) => {
          console.log(error);
        });
    }, []) 
  );

  useEffect(() => {
    if (user.id === -1) {
      return;
    }

    if (user.completedSegments?.includes(parseInt(params.id as string))) {
      return;
    }

    console.log(JSON.stringify(user.completedDays));
    for (let i = 0; i < programDays.length; i++) {
      if (!user.completedDays?.includes(programDays[i].id)) {
        return;
      }
    }

    fetch(
      "https://haos.willc-dev.net/segments/complete/" + user.id + "/" + params.id,
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
          user.completedSegments.push(parseInt(params.id as string));
          SecureStore.setItemAsync("user", JSON.stringify(user));
        } else {
          console.log("Error in Segment Details: " + response);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [programDays]);

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
          <View style={stylesheet.dayList}>
            {programDays?.map((day, index) => {
              var completed = false;
              if (user.completedDays) {
                if (user.completedDays.includes(day.id)) {
                  completed = true;
                }
              }
              return (
                <ContentCard
                  index={index}
                  key={day.id}
                  title={"Day " + (index + 1) + ": " + day.title}
                  description={"Week " + day.weekNum}
                  checked={completed}
                  action={() => {
                    router.push({
                      pathname: "/training/ProgramDayDetails",
                      params: {
                        id: day.id,
                      },
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

  dayList: {
    width: "100%",
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
  },
});
