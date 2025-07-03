import { ProgramDay } from "@/Models/TrainingTypes";
import { StyleSheet, View } from "react-native";
import ContentCard from "../ContentCard";

type DayListParams = {
  days: ProgramDay[];
  selectAction: Function;
  backAction: Function;
};

export default function DayList(params: DayListParams) {
  return (
    <View style={stylesheet.container}>
      <View style={stylesheet.dayList}>
        {params.days?.map((day, index) => {
          return (
            <ContentCard
              key={day.id}
              title={day.title}
              description={"Week " + day.weekNum}
              action={() => params.selectAction(day.id)}
            />
          );
        })}
      </View>
    </View>
  );
}

const stylesheet = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },

  dayList: {
    width: "80%",
  },
});
