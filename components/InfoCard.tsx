import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

type InfoCardParams = {
  title: string;
  description?: string;
  embedSource: string;
};

const videoSource = "https://www.youtube.com/embed/1aBDt_yM0wA";

export default function InfoCard(params: InfoCardParams) {
  return (
    <View style={styles.CardContainer}>
      <View
        style={{ width: "auto", height: 280, borderRadius: 15, padding: 10 }}
      >
        <WebView
          style={{ width: 150, height: 400, borderRadius: 20 }}
          source={{ uri: params.embedSource }}
        />
      </View>
      <Text style={styles.CardTitle}>{params.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  CardContainer: {
    borderRadius: 15,
    backgroundColor: "rgba(37, 28, 28, 1)",
    width: 180,
    paddingTop: 5,
    margin: 10,
    alignContent: "space-between",
    alignItems: "center",
    boxShadow: "1px 1px 5px 1px rgba(0,0,0,0.2)",
  },

  CardTitle: {
    color: "white",
    width: "80%",
    fontWeight: 800,
    fontSize: 16,
    textAlign: "center",

    marginLeft: 10,
    marginRight: 10,

    paddingBottom: 10,

    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.67)",
  },

  CardDescription: {
    color: "white",
    fontWeight: 600,
  },
});
