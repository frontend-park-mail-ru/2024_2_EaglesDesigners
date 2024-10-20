import { API } from "@/shared/api/api";
import { TUser } from "../index";
import { AuthResponse } from "@/shared/api/types";

class UserStore {
  #user: TUser;

  constructor() {
    this.#user = { id: 0, name: "", username: "" };
  }

  async init() {
    const response = await API.get<AuthResponse>("/auth");
    if (!response.error) {
      this.#user = response.user;
    }
  }

  setUser(user: TUser) {
    this.#user = user;
  }

  getUser() {
    return this.#user;
  }
}

export const UserStorage = new UserStore();