import { TrainingProgram } from "@/Models/TrainingTypes";
import { CompletedWorkout, UserAccount, UserType } from "@/Models/UserAccount";
import * as SecureStore from "expo-secure-store";

const CURRENT_USER = {
    id: -1,
    userType: UserType.User,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    subscribedPrograms: [] as TrainingProgram[],
    completedWorkouts: [] as CompletedWorkout[],
    completedCircuits: [] as number[],
    completedDays: [] as number[],
    completedSegments: [] as number[],
    completedPrograms: [] as number[],
}

export function GetCurrentUser(): UserAccount {
    return CURRENT_USER;
}

export function LoginUser(email: string, password: string, success: () => void, failure: (error: string) => void) {
    const user: UserAccount = {
        id: 0,
        userType: UserType.User,
        firstName: "",
        lastName: "",
        email: email,
        password: password,
        subscribedPrograms: [],
        completedWorkouts: [],
        completedCircuits: [],
        completedDays: [],
        completedSegments: [],
        completedPrograms: [],
      };
    const payload = JSON.stringify(user);

    fetch("https://haos.willc-dev.net/user/login", {
        method: "POST",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "HAOSAPIauthorizationToken",
        },
        body: payload,
    })
        .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Invalid login credentials.");
        }
        })
        .then((data: UserAccount) => {
            success();
            UpdateUserInfo(data.id);
            SecureStore.setItemAsync("user", data.id.toString());
        })
        .catch((error) => {
            failure(error.message);
        });
}

export function LogoutUser(complete: () => void) {
    SecureStore.deleteItemAsync("user").then(() => {
        CURRENT_USER.id = -1;
        CURRENT_USER.userType = UserType.User;
        CURRENT_USER.firstName = "";
        CURRENT_USER.lastName = "";
        CURRENT_USER.email = "";
        CURRENT_USER.password = "";
        CURRENT_USER.subscribedPrograms = [];
        CURRENT_USER.completedWorkouts = [];
        CURRENT_USER.completedCircuits = [];
        CURRENT_USER.completedDays = [];
        CURRENT_USER.completedSegments = [];
        CURRENT_USER.completedPrograms = [];
        complete();
    });
}

export async function CheckUserLogin(success: () => void, failure: (error: string) => void) {
    let userId = await SecureStore.getItemAsync("user");
    if (userId) {
        await UpdateUserInfo(parseInt(userId));
        success();
    } else {
        failure("No user logged in.");
    }
}

async function UpdateUserInfo (userId: number) {
    let response = await fetch("https://haos.willc-dev.net/user/find/" + userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "HAOSAPIauthorizationToken",
      },
    });
    if (response.ok) {
        let data = await response.json();
        if (data.completedPrograms == undefined) data.completedPrograms = [];
        if (data.completedSegments == undefined) data.completedSegments = [];
        if (data.completedDays == undefined) data.completedDays = [];
        if (data.completedCircuits == undefined) data.completedCircuits = [];
        if (data.completedWorkouts == undefined) data.completedWorkouts = [];
        SetUserData(data);
    }
}

function SetUserData(data: UserAccount) {
    CURRENT_USER.id = data.id;
    CURRENT_USER.userType = data.userType;
    CURRENT_USER.firstName = data.firstName;
    CURRENT_USER.lastName = data.lastName;
    CURRENT_USER.email = data.email;
    CURRENT_USER.subscribedPrograms = data.subscribedPrograms;
    CURRENT_USER.completedWorkouts = data.completedWorkouts;
    CURRENT_USER.completedCircuits = data.completedCircuits;
    CURRENT_USER.completedDays = data.completedDays;
    CURRENT_USER.completedSegments = data.completedSegments;
    CURRENT_USER.completedPrograms = data.completedPrograms;
}

