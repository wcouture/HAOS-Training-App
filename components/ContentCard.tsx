import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ContentCardParams = {
  title: string;
  description: string;
  action: Function;
};

export default function ContentCard({
  title,
  description,
  action,
}: ContentCardParams) {
  const [_cardTitle, setCardTitle] = useState("");
  const [_cardDescription, setCardDescription] = useState("");

  useEffect(() => {
    setCardTitle(title);
    setCardDescription(description);
  }, []);

  return (
    <Pressable onPress={() => action()}>
      <View style={styles.CardContainer}>
        <Text style={styles.CardTitle}>{_cardTitle}</Text>
        <Text style={styles.CardDescription}>{_cardDescription}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  CardContainer: {
    borderRadius: 15,
    backgroundColor: "#B00",
    width: "auto",
    padding: 20,
    margin: 20,
    alignContent: "center",
    alignItems: "center",
    boxShadow: "1px 1px 5px 1px rgba(0,0,0,0.2)",
  },

  CardTitle: {
    color: "white",
    fontWeight: 800,
    fontSize: 20,
    textAlign: "left",
    width: "100%",
  },

  CardDescription: {
    color: "white",
    fontWeight: 600,
    textAlign: "left",
    width: "100%",
  },
});
