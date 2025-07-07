import { ProgramSegment } from "@/Models/TrainingTypes";
import { StyleSheet, View } from "react-native";
import ContentCard from "../../components/ContentCard";

type SegmentListProps = {
  segments: ProgramSegment[];
  selectAction: Function;
  backAction: Function;
};

export default function SegmentList({
  segments,
  selectAction,
  backAction,
}: SegmentListProps) {
  return (
    <View style={stylesheet.container}>
      <View style={stylesheet.segmentList}>
        {segments.map((segment) => {
          return (
            <ContentCard
              key={segment.id}
              title={segment.title}
              description={segment.subtitle}
              action={() => selectAction(segment)}
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

  segmentList: {
    width: "80%",
  },
});
