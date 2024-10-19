import { TUser } from "../index";

class UserStore {
  #user: TUser;

  constructor() {
    this.#user = { id: 0, name: "", username: "" };
  }

  setUser(user: TUser) {
    this.#user = user;
  }

  getUser() {
    return this.#user;
  }
}

export const UserStorage = new UserStore();
