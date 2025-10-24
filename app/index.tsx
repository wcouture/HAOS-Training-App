import { CheckUserLogin } from "@/services/AccountService";
import { useEventListener } from "expo";
import { router } from "expo-router";
import { useVideoPlayer, VideoPlayerStatus, VideoView } from "expo-video";
import React, { useEffect, useState } from "react";
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";


const splashScreenSource = '@/assets/splash.mp4';
const assetID = require(splashScreenSource)

export default function LandingScreen() {
  const [splashScreenPlaying, setSplashScreenPlaying] = useState(null as VideoPlayerStatus | null);
  const [loggedIn, setLoggedIn] = useState(false);
  
  const splashPlayer = useVideoPlayer(assetID, splashPlayer => {
    splashPlayer.loop = false;
    splashPlayer.play()
  });

  useEventListener(splashPlayer, 'statusChange', ({ status, error }) => {
    setSplashScreenPlaying(status);
  });

  useEffect(() => {
    CheckUserLogin(
      () => {
        setLoggedIn(true);
      },
      (error) => {
        //console.error(error);
      }
    );
  }, []);

  useEffect(() => {
    // console.error(splashScreenPlaying)
    if (loggedIn && splashScreenPlaying == "idle") {
      router.dismissAll;
      router.replace("/home");
    }
  }, [splashScreenPlaying]);

  const landing_screen = () => { 
    return (
    <SafeAreaProvider>
      <SafeAreaView style={stylesheet.PageView}>
        <View style={stylesheet.PageRow}>
          <Image style={stylesheet.HAOSLogo} source={require("@/assets/images/HAOS-logo.png")}/>
          
        </View>
        

        <View style={stylesheet.PageRow}>
          <View style={stylesheet.HeaderSection}>
            <Text style={stylesheet.MainTitle}>HAOS</Text>
            <Text style={stylesheet.SubTitle}>Your #1 Training Team</Text>
            <Text style={stylesheet.SubText}>
              For anybody and any race. HAOS is the academy for high performers.
            </Text>
          </View>
        </View>

        <View style={stylesheet.PageRow}>
          <View style={stylesheet.ActionsContainer}>
            <Pressable
              onPress={() => {
                router.push("/register");
              }}
            >
              <View style={stylesheet.ActionButton}>
                <Text style={stylesheet.ActionButtonText}>JOIN THE TEAM</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                router.push("/login");
              }}
            >
              <View style={stylesheet.ActionButton}>
                <Text style={stylesheet.ActionButtonText}>
                  EXISTING MEMBERS
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>);
    }

  if (splashScreenPlaying != "idle") {
    return (
    <SafeAreaProvider>
      <SafeAreaView style={stylesheet.PageView}>
        <VideoView nativeControls={false} player={splashPlayer} style={stylesheet.splashScreenPlayer}/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
  }
  else {
    return landing_screen();
  }
}

const stylesheet = StyleSheet.create({
  splashScreenPlayer: {
    flex: 1,
    height: "120%",
    backgroundColor: "#000",
  },

  HAOSLogo: {
    width: 250,
    height: 250,
    tintColor: "black",
    marginTop: 100,
    marginLeft: "auto",
    marginRight: "auto"
  },

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
    display: "flex",
    justifyContent: "flex-start",
    paddingTop: 60,
    height: "100%"
  },

  MainTitle: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 10,
  },
  SubTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  SubText: {
    textAlign: "center",
    fontSize: 18,
  },

  ActionsContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
    maxWidth: "65%",
    gap: 35,
    paddingTop: 50,
    paddingBottom: 50,
  },

  ActionButton: {
    borderWidth: 3,
    borderRadius: 8,
    borderStyle: "solid",
    borderColor: "#444",
    backgroundColor: "#fff",
    width: "100%",
    boxShadow: "1px 1px 5px 2px solid rga(0,0,0,0.3)"
  },

  ActionButtonText: {
    textAlign: "center",
    color: "#444",
    fontWeight: 400,
    fontSize: 26,
    padding: 20,
  },
});
