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
    if (user.id == -1) return;

    // If user hasn't completed any circuits or data hasn't loaded yet, return
    user.completedSessions ??= [];

    if (user.completedSessions.length == 0 || sessions.length == 0) {
      return;
    }

    // If this day already complete, return
    user.completedDays ??= [];
    if (user.completedDays?.includes(parseInt(params.id as string))) {
      return;
    }

    for (let i = 0; i < sessions.length; i++) {
      // If any sessions aren't completed, return
      if (!user.completedSessions.includes(sessions[i].id)) {
        return;
      }
    }

    // All sessions are complete
    // Mark this day as complete
    console.log("Marking day complete: " + params.id);
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
          console.log(response.url)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [sessions, user]);

  useEffect(() => {

  }, [user]);
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
            <IconSymbol size={28} name="chevron.left" color="white" />
          </Pressable>
          <Text style={stylesheet.HeaderText}>{headerText}</Text>
        </View>
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
        
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const stylesheet = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(170, 11, 11, 1)",
  },
  HeaderContainer: {
    alignItems: "center",
    borderColor: "black",
    width: "80%",
    marginTop: 35,
  },
  HeaderText: {
    fontSize: 28,
    fontWeight: 800,
    textAlign: "center",
    color: "white",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.2)",
    paddingBottom: 20,
  },

  circuitList: {
    width: "100%",
    backgroundColor: "white",
    height: "100%",
    boxShadow: "1px 1px 5px 5px rgba(0, 0, 0, 0.2) inset",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
  },
});
