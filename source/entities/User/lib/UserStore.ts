import { API } from "@/shared/api/api";
import { TUser } from "../index";
import { AuthResponse } from "@/shared/api/types";
import { wsConn } from "@/shared/api/ws";

class UserStore {
  #user: TUser;

  constructor() {
    this.#user = { id: "", name: "", username: "" };
  }

  async init() {
    const response = await API.get<AuthResponse>("/auth");
    if (!response.error) {
      this.#user = response.user;
      wsConn.start();
    }
  }

  setUser(user: TUser) {
    this.#user = user;
  }

  getUser() {
    return this.#user;
  }

setUserName(name: string) {
    this.#user.name = name;
  }
}

export const UserStorage = new UserStore();
