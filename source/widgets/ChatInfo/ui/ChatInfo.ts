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
    const usersInChat = await API.get<UsersIdResponse>(
      "/chat/" + this.#chat.chatId,
    );
    let user;
    if (usersInChat.users) {
      user = usersInChat.users[(usersInChat.users[0].id !== UserStorage.getUser().id) ? 0 : 1];
      const profileUser = await API.get<ProfileResponse>("/profile/" + user.id);
      const birthdate = moment(profileUser.birthdate)
        .utc()
        .format("DD.MM.YYYY");
      if (profileUser.avatarURL) {
        profileUser.avatarURL = serverHost + profileUser.avatarURL;
      } else {
        profileUser.avatarURL = "/assets/image/default-avatar.svg";
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
      };

      deleteChatButton.addEventListener("click", handleDeleteGroup);
    }

    this.#parent.querySelector('#chat-info-close-button')!.addEventListener('click', () => {
      this.#parent.style.right = '-100vw';
      this.#parent.innerHTML = '';
    });

    this.#parent.style.right = '0';
  }
}
