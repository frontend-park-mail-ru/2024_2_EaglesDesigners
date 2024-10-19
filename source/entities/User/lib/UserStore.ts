class UserStore {
  #userNickname : string;

  constructor() {
    this.#userNickname = '';
  }

  setUserName(nick: string) {
    this.#userNickname = nick;
  }

  getUserName() {
    return this.#userNickname;
  }
}

export const UserStorage = new UserStore();
