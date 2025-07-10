import ContentCard from "@/components/ContentCard";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Circuit } from "@/Models/TrainingTypes";
import { UserAccount } from "@/Models/UserAccount";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ProgramDayDetails() {
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [user, setUser] = useState({ id: -1 } as UserAccount);
  const [headerText, setHeaderText] = useState<string>("");
  const params = useLocalSearchParams();

  useEffect(() => {
    const programDayId = params.id;

    SecureStore.getItemAsync("user").then((userData) => {
      if (userData) {
        setUser(JSON.parse(userData));
      }
    });

    fetch("http://localhost:5164/days/find/" + programDayId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "HAOSAPIauthorizationToken",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Invalid login credentials.");
        }
      })
      .then((data) => {
        setCircuits(data.circuits);
        setHeaderText(data.title);
      })
      .catch((error) => {
        console.log("Error in Program Day Details: " + error);
      });
  }, []);

  useEffect(() => {
    // If user hasn't completed any circuits or data hasn't loaded yet, return
    if (!user.completedCircuits) {
      return;
    }

    // If this day already complete, return
    if (user.completedDays?.includes(parseInt(params.id as string))) {
      return;
    }

    for (let i = 0; i < circuits.length; i++) {
      // If any circuits aren't completed, return
      if (!user.completedCircuits.includes(circuits[i].id)) {
        console.log("Not all circuits completed");
        return;
      }
    }

    // All circuits are complete
    // Mark this day as complete
    fetch("http://localhost:5164/days/complete/" + user.id + "/" + params.id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "HAOSAPIauthorizationToken",
      },
    })
      .then((response) => {
        if (response.ok) {
          user.completedDays.push(parseInt(params.id as string));
          SecureStore.setItemAsync("user", JSON.stringify(user));
        } else {
          console.log("Error completing day: " + response.status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [circuits]);
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
            {circuits?.map((circuit, index) => {
              var completed = false;
              if (user && user.completedCircuits.includes(circuit.id)) {
                completed = true;
              }

              return (
                <ContentCard
                  index={index}
                  key={circuit.id}
                  title={"P" + (index + 1)}
                  description={circuit.description}
                  action={() => {
                    router.push({
                      pathname: "/training/CircuitDetails",
                      params: {
                        id: circuit.id,
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
  },
  HeaderContainer: {
    alignItems: "center",
    borderColor: "black",
    width: "80%",
    marginBottom: 20,
    marginTop: 20,
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
