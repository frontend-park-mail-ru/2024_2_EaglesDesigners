import { TUser } from "../model/type";

class UserStore {
  #user: TUser;

  constructor() {
    this.#user = { id: 0, name: "", username: "" };
  }

  setUserName(nick: string) {
    this.#user.name = nick;
  }

  getUserName() {
    return this.#user.name;
  }
}

export const UserStorage = new UserStore();
