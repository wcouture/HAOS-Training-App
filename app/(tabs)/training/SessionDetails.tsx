import ContentCard from "@/components/ContentCard";
import CompletedWorkoutModal from "@/components/training/CompletedWorkoutModal";
import CompleteWorkoutModal from "@/components/training/CompleteWorkoutModal";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Circuit, Workout } from "@/Models/TrainingTypes";
import { CompletedWorkout, UserAccount } from "@/Models/UserAccount";
import { CheckUserLogin, GetCurrentUser } from "@/services/AccountService";
import { getSessionData } from "@/services/ProgramDataService";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function SessionDetails() {
  const [workouts, setWorkouts] = useState<Workout[]>([] as Workout[]);
  const [circuits, setCircuits] = useState<Circuit[]>([] as Circuit[]);
  const [headerText, setHeaderText] = useState("");
  const [user, setUser] = useState({ id: -1 } as UserAccount);

  const [selectedWorkout, setSelectedWorkout] = useState<Workout>(
    {} as Workout
  );
  const [selectedCompleteWorkout, setSelectedCompleteWorkout] =
    useState<CompletedWorkout>({} as CompletedWorkout);
  const [modalVisible, setModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);

  const params = useLocalSearchParams();

  const completeWorkout = async (workoutId: number, userInput: number[]) => {
    var workout = selectedWorkout;
    if (workout.id !== workoutId) {
      console.log("Error: workout id mismatch");
      return;
    }

    var completedWorkout: CompletedWorkout = {
      id: 0,
      workoutId: workoutId,
      userId: user.id,
      completedDate: new Date(),
      trackingType: workout.trackingType_,
      metrics: userInput,
    };

    const response = await fetch(
      "https://haos.willc-dev.net/userworkouts/add?userId=" + user.id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "HAOSAPIauthorizationToken",
        },
        body: JSON.stringify(completedWorkout),
      }
    );

    if (response.ok) {
      completedWorkout = (await response.json()) as CompletedWorkout;
      CheckUserLogin(() => {
        const userObj: UserAccount = GetCurrentUser();
        setUser(userObj);

        for (var j = 0; j < circuits.length; j++) {
          var fullComplete = true;
          for (var i = 0; i < circuits[j].workouts.length; i++) {
            if (
              !userObj.completedWorkouts.find(
                (x) => x.workoutId == circuits[j].workouts[i].id
              )
            ) {
              fullComplete = false;
              break;
            }
          }
          if (fullComplete) {
            completeCircuit(circuits[j].id);
          }
        }
        setSelectedWorkout({} as Workout);
        setModalVisible(false);
      }, (error) => { 
        console.log(error); 
        setSelectedWorkout({} as Workout);
        setModalVisible(false);
      });

      
    }
  };

  const checkSessionComplete = async () => {
    console.log("Completed sessions: " + JSON.stringify(user.completedSessions));
    // If user hasn't completed any circuits or data hasn't loaded yet, return
    user.completedCircuits ??= [];

    // If this day already complete, return
    if (user.completedSessions?.includes(parseInt(params.id as string))) {
      return;
    }

    for (let i = 0; i < circuits.length; i++) {
      // If any circuits aren't completed, return
      if (!user.completedCircuits.includes(circuits[i].id)) {
        console.log("Not all circuits in session complete");
        return;
      }
    }

    // All circuits are complete
    // Mark this session as complete
    fetch("https://haos.willc-dev.net/sessions/complete/" + user.id + "/" + params.id, {
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
          console.log("Error completing session: " + response.status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const completeCircuit = async (circuitId: Number) => {
    fetch(
      "https://haos.willc-dev.net/circuits/complete/" + user.id + "/" + circuitId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "HAOSAPIauthorizationToken",
        },
      }
    ).then((response) => {
      if (response.ok) {
        CheckUserLogin(() => {
          console.log("Circuit completed successfully");
          let userData = GetCurrentUser();
          if (userData) {
            setUser(userData);
            CheckUserLogin(() => {checkSessionComplete()}, (error) => { console.log(error); });
          }
        }, (error) => { console.log(error); });
      }else {
        console.log("Error completing circuit: " + response.status);
      }
    });
  };

  const loadSessionData = async (sessionId: number) => {
    let data = await getSessionData(sessionId);
    if (data === null) {
      console.log("Error loading session data for id: " + sessionId);
      return;
    }
    setCircuits(data.circuits);
    setHeaderText(data.title);
  }

  useFocusEffect(
    useCallback(() => {
      const id = params.id;
      const index = parseInt(params.index as string);
      
      CheckUserLogin(() => {
        let userData = GetCurrentUser();
        if (userData) {
          setUser(userData);
        }
        
        loadSessionData(parseInt(id as string));
      }, (error) => { console.log(error) });
    }, [])
  );

  useEffect(() => {
    if (user.id === -1) {
      return;
    }
    checkSessionComplete();
  }, [circuits])
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
          <View style={stylesheet.workoutList}>
            {circuits.map((circuit) => {
              return (
                <View key={circuit.id}>
                  {circuit.workouts?.map((workout, index) => {
                    var completed = false;
                    const completedWorkoutIndex = user.completedWorkouts?.findIndex(
                      (w) => w.workoutId === workout.id
                    );
                    if (user && completedWorkoutIndex !== -1) {
                      completed = true;
                    }
                    return (
                      <ContentCard
                        index={index}
                        key={workout.id}
                        title={workout.exercise_?.name}
                        description={workout.description}
                        action={() => {
                          if (!completed) {
                            setSelectedWorkout(workout);
                            setModalVisible(true);
                          } else {
                            setSelectedCompleteWorkout(
                              user.completedWorkouts[completedWorkoutIndex]
                            );
                            setCompleteModalVisible(true);
                          }
                        }}
                        checked={completed}
                      />
                    );
                  })}
                  <View style={stylesheet.separator}/>
                </View>
                
              );
            })}    
          </View>
        <CompleteWorkoutModal
          isVisible={modalVisible}
          setIsVisible={setModalVisible}
          selectedWorkout={selectedWorkout}
          onComplete={completeWorkout}
        />
        <CompletedWorkoutModal
          isVisible={completeModalVisible}
          setIsVisible={setCompleteModalVisible}
          completedWorkout={selectedCompleteWorkout}
        />
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
    width: "100%",
    color: "white",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.2)",
    paddingBottom: 20,
  },

  workoutList: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
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

  separator: {
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 1,
    width: '80%',
    marginVertical: 10,
    alignSelf: 'center',
  },
});
