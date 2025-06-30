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
};
