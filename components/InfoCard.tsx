import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type InfoCardParams = {
  title: string;
};

export default function InfoCard({ title }: InfoCardParams) {
  const [_cardTitle, setCardTitle] = useState("");

  useEffect(() => {
    setCardTitle(title);
  }, []);

  return (
    <View style={styles.CardContainer}>
      <Text style={styles.CardTitle}>USA GYM TOUR</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  CardContainer: {
    borderRadius: 15,
    backgroundColor: "#B00",
    width: 200,
    padding: 20,
    margin: 20,
    alignContent: "center",
    alignItems: "center",
    boxShadow: "1px 1px 5px 1px rgba(0,0,0,0.2)",
  },

  CardTitle: {
    color: "white",
    fontWeight: 800,
  },
});
