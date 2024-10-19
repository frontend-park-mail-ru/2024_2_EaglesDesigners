import { API } from "@/shared/api/api";
import { AuthResponse } from "@/shared/api/types";

class UserStore {
  #userNickname: string = "";

  async init() {
    const response = await API.get<AuthResponse>("/auth");
    if (!response.error) {
      this.#userNickname = response?.user?.name;
    }
  }

  setUserName(nick: string) {
    this.#userNickname = nick;
  }

  getUserName() {
    return this.#userNickname;
  }
}

export const UserStroage = new UserStore();
UserStroage.init();
