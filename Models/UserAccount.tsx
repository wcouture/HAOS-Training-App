import { TrainingProgram, WorkoutTrackingType } from "./TrainingTypes";

export enum UserType {
  Admin = 1,
  User = 2,
}
export type UserAccount = {
  id: number;
  userType: UserType;
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  subscribedPrograms: TrainingProgram[];
  completedWorkouts: CompletedWorkout[];

  completedCircuits: number[];
  completedSessions: number[];
  completedDays: number[];
  completedSegments: number[];
  completedPrograms: number[];
};

export type CompletedWorkout = {
  id: number;
  workoutId: number;
  userId: number;
  completedDate: Date;
  trackingType: WorkoutTrackingType;
  metrics: number[];
};
