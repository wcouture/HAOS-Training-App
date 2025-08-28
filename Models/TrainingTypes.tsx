export type TrainingProgram = {
  id: number;
  title: string;
  subtitle: string;
  segments: ProgramSegment[];
};

export type ProgramSegment = {
  id: number;
  title: string;
  subtitle: string;
  programId: number;
  days: ProgramDay[];
};

export type ProgramDay = {
  id: number;
  title: string;
  weekNum: number;
  segmentId: number;
  sessions: Session[];
};

export type Session = {
  id: number;
  title: string;
  programDayId: number;
  circuits: Circuit[];
}

export type Circuit = {
  id: number;
  description: string;
  rounds: number;
  sessionId: number;
  workouts: Workout[];
};

export type Workout = {
  id: number;
  description: string;
  circuitId: number;
  exercise_: Exercise;
};

export type Exercise = {
  id: number;
  name: string;
  demoUrl: string;
  type: ExerciseType;
};

export enum ExerciseType {
  Strength = 1,
  Endurance = 2,
}

export function getExerciseTypeString(exerciseType: ExerciseType): string {
  switch (exerciseType) {
    case ExerciseType.Strength:
      return "Strength";
    case ExerciseType.Endurance:
      return "Endurance";
  }
}
