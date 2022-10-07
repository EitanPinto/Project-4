import { IUserDB } from "./businessLogic";

export function isPasswordMatch(userObj: IUserDB, password: string): boolean {
  return userObj.password === password;
};

