import ContentCard from "@/components/ContentCard";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Session } from "@/Models/TrainingTypes";
import { UserAccount } from "@/Models/UserAccount";
import { CheckUserLogin, GetCurrentUser } from "@/services/AccountService";
import { getDayData } from "@/services/ProgramDataService";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ProgramDayDetails() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [user, setUser] = useState({ id: -1 } as UserAccount);
  const [headerText, setHeaderText] = useState<string>("");
  const params = useLocalSearchParams();

  const loadDayData = async (dayId: number) => {
    let data = await getDayData(dayId);
    if (data === null) {
      console.log("Error loading day data for id: " + dayId);
      return;
    }
    setSessions(data.sessions);
    setHeaderText(data.title);
  }

  useFocusEffect(
    useCallback(() => {
      const programDayId = params.id;

      let userData = GetCurrentUser();
      if (userData) {
        setUser(userData);
      }

      loadDayData(parseInt(programDayId as string));
    }, [])
  );

  useEffect(() => {
    // If user hasn't completed any circuits or data hasn't loaded yet, return
    if (!user.completedSessions) {
      return;
    }

    // If this day already complete, return
    user.completedDays ??= [];
    if (user.completedDays?.includes(parseInt(params.id as string))) {
      return;
    }

    for (let i = 0; i < sessions.length; i++) {
      // If any circuits aren't completed, return
      if (!user.completedSessions.includes(sessions[i].id)) {
        return;
      }
    }

    // All circuits are complete
    // Mark this day as complete
    fetch("https://haos.willc-dev.net/days/complete/" + user.id + "/" + params.id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "HAOSAPIauthorizationToken",
      },
    })
      .then((response) => {
        if (response.ok) {
          CheckUserLogin(() => {}, (error) => { console.log(error); });
        } else {
          console.log("Error completing day: " + response.status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [sessions]);
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
          <View style={stylesheet.circuitList}>
            {sessions?.map((session, index) => {
              var completed = false;
              user.completedSessions ??= [];
              if (user && user.completedSessions.includes(session.id)) {
                completed = true;
              }

              return (
                <ContentCard
                  index={index}
                  key={session.id}
                  title={"P" + (index + 1)}
                  description={session.title}
                  action={() => {
                    router.push({
                      pathname: "/training/SessionDetails",
                      params: {
                        id: session.id,
                        index: index,
                      },
                    });
                  }}
                  checked={completed}
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

  circuitList: {
    width: "100%",
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
  },
});
