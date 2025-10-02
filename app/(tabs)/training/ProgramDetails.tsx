import ContentCard from "@/components/ContentCard";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TrainingProgram } from "@/Models/TrainingTypes";
import { UserAccount } from "@/Models/UserAccount";
import { CheckUserLogin, GetCurrentUser } from "@/services/AccountService";
import { getProgramData } from "@/services/ProgramDataService";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ProgramDetails() {
  const localParams = useLocalSearchParams();
  const [programData, setProgramData] = useState<TrainingProgram | null>(null);
  const [headerText, setHeaderText] = useState("");
  const [user, setUser] = useState({ id: -1 } as UserAccount);

  const loadProgramData = async (id: number) => {
    let data = await getProgramData(id);
    
    if (data === null) {
      console.log("Error loading program data for id: " + id);
      return;
    }

    setProgramData(data);
    setHeaderText(data.title);
  };

  useFocusEffect(
    useCallback(() => {
      const programId = parseInt(localParams.id as string);

      let userData = GetCurrentUser();
      if (userData) {
        setUser(userData);
      }
      loadProgramData(programId);
    }, [])
  );

  useEffect(() => {
    if (user.id == -1) {
      return;
    }

    if (user.completedPrograms?.includes(programData?.id as number)) {
      return;
    }

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
          CheckUserLogin(() => {}, (error) => {
            console.error(error)});
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
            <IconSymbol size={28} name="chevron.left" color="white" />
          </Pressable>
          <Text style={stylesheet.HeaderText}>{headerText}</Text>
        </View>
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
        
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const stylesheet = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(170, 11, 11, 1)",
    alignItems: "center",
    justifyContent: "flex-start",
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
    paddingBottom: 20,
    color: "#fff",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.2)",
  },

  SegmentList: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    boxShadow: "1px 1px 5px 5px rgba(0, 0, 0, 0.2) inset",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
  },

  backButton: {
    position: "absolute",
    color: "#fff",
    left: 0,
    top: 0,
    zIndex: 1,
  },
});
