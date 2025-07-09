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
      <Text style={styles.CardTitle}>{params.title}</Text>
      {params.description ? (
        <Text style={styles.CardDescription}>{params.description}</Text>
      ) : null}
      <View
        style={{ width: "auto", height: 280, borderRadius: 15, padding: 10 }}
      >
        <WebView
          style={{ width: 150, height: 300, borderRadius: 10 }}
          source={{ uri: params.embedSource }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  CardContainer: {
    borderRadius: 15,
    backgroundColor: "#B00",
    width: 200,
    padding: 20,
    margin: 10,
    alignContent: "center",
    alignItems: "center",
    boxShadow: "1px 1px 5px 1px rgba(0,0,0,0.2)",
  },

  CardTitle: {
    color: "white",
    fontWeight: 800,
    fontSize: 20,
  },

  CardDescription: {
    color: "white",
    fontWeight: 600,
  },
});
