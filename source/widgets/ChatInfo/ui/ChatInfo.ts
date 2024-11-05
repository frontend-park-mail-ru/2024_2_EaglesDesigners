import { API } from "@/shared/api/api";
import ChatInfoTemplate from "./ChatInfo.handlebars";
import "./ChatInfo.scss";
import { UserStorage } from "@/entities/User";
import { serverHost } from "@/app/config";
import { TChat } from "@/entities/Chat";
import { ProfileResponse, UsersIdResponse } from "@/shared/api/types";
import { Router } from "@/shared/Router/Router";
import * as moment from "moment";

export class ChatInfo {
  #parent;
  #chat;
  constructor(parent: Element, chat: TChat) {
    this.#parent = parent;
    this.#chat = chat;
  }

  async render() {
    console.log(this.#chat);
    const usersId = await API.get<UsersIdResponse>(
      "/chat/" + this.#chat.chatId + "/users",
    );
    console.log(usersId, UserStorage.getUser().id);
    let userId;
    if (usersId.usersId[0] !== UserStorage.getUser().id) {
      userId = usersId.usersId[0];
    } else {
      userId = usersId.usersId[1];
    }
    const profileUser = await API.get<ProfileResponse>("/profile/" + userId);
    const birthdate = moment(profileUser.birthdate).utc().format("YYYY-MM-DD");
    if (profileUser.avatarURL) {
      profileUser.avatarURL =
        serverHost + profileUser.avatarURL + "?" + Date.now();
    }
    this.#parent.innerHTML = ChatInfoTemplate({ profileUser, birthdate });

    const deleteChatButton = this.#parent.querySelector("#delete-chat")!;

    const handleDeleteGroup = async () => {
      const response = await API.delete(
        "/chat/" + this.#chat.chatId + "/delete",
        this.#chat.chatId,
      );
      if (!response.error) {
        Router.go("/");
      }
      console.log(response);
    };

    deleteChatButton.addEventListener("click", handleDeleteGroup);
  }
}
