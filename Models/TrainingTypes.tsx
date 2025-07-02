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
  circuits: Circuit[];
};

export type Circuit = {
  id: number;
  description: string;
  rounds: number;
  programDayId: number;
  workouts: Workout[];
};

export type Workout = {
  id: number;
  description: string;
  circuitId: number;
  exercise: Exercise;
};

export type Exercise = {
  id: number;
  name: string;
  demoUrl: string;
};
