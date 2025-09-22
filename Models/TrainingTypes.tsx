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
  sessionId: number;
  workouts: Workout[];
};

export type Workout = {
  id: number;
  description: string;
  circuitId: number;
  exercise_: Exercise;
  rounds: number;
  trackingType_: WorkoutTrackingType;
};

export type Exercise = {
  id: number;
  name: string;
  demoUrl: string;
};

export enum WorkoutTrackingType {
  Reps = 1,
  Time = 2,
  Distance = 3,
  Rounds = 4,
  Weight = 5,
  Calories = 6,
  Completed = 7,
}

export function getExerciseTypeString(workoutType: WorkoutTrackingType): string {
  switch (workoutType) {
    case WorkoutTrackingType.Reps:
      return "Reps";
    case WorkoutTrackingType.Time:
      return "Time";
    case WorkoutTrackingType.Distance:
      return "Distance";
    case WorkoutTrackingType.Rounds:
      return "Rounds";
    case WorkoutTrackingType.Weight:
      return "Weight";
    case WorkoutTrackingType.Calories:
      return "Calories";
    case WorkoutTrackingType.Completed:
      return "Completed";
    default:
      return "";
  }
}
