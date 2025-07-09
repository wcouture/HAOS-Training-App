import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ContentCardParams = {
  index: number;
  title?: string;
  description?: string;
  action: Function;
  checked?: boolean;
};

export default function ContentCard({
  title,
  description,
  action,
  checked,
  index,
}: ContentCardParams) {
  const [_cardTitle, setCardTitle] = useState("");
  const [_cardDescription, setCardDescription] = useState("");

  useEffect(() => {
    setCardTitle(title ?? "");
    setCardDescription(description ?? "");
  }, []);

  return (
    <Pressable onPress={() => action()}>
      <View
        style={[
          styles.CardContainer,
          index % 2 === 0 ? styles.Red : styles.Grey,
        ]}
      >
        <View style={styles.CardTextSection}>
          <Text style={styles.CardTitle}>{_cardTitle}</Text>
          <Text style={styles.CardDescription}>{_cardDescription}</Text>
        </View>
        <View
          style={
            checked
              ? [styles.CardIndicator, styles.Checked]
              : styles.CardIndicator
          }
        ></View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  Red: {
    backgroundColor: "#B00",
  },

  Grey: {
    backgroundColor: "#707070",
  },

  CardContainer: {
    borderRadius: 15,

    width: "auto",
    padding: 20,
    margin: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
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

  CardTextSection: {
    width: "auto",
    alignItems: "flex-start",
  },

  CardIndicator: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 20,
    backgroundColor: "",
  },

  Checked: {
    backgroundColor: "#0F0",
  },
});
