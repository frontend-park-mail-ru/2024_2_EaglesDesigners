import { API } from "@/shared/api/api";
import GroupChatInfoTemplate from "./GroupChatInfo.handlebars";
import "./GroupChatInfo.scss";
import { TChat } from "@/entities/Chat";
import { UserAddChat } from "@/widgets/UserAddChat/ui/UserAddChat";
import { GroupUpdate } from "@/widgets/GroupUpdate/ui/GroupUpdate";
import { ProfileResponse, UsersIdRequest } from "@/shared/api/types";
import { ContactCard } from "@/entities/ContactCard/ui/ContactCard";
import { TContact } from "@/entities/ContactCard";
import { Router } from "@/shared/Router/Router";
import { serverHost } from "@/app/config";

export class GroupChatInfo {
  #parent;
  #chat;
  constructor(parent: Element, chat: TChat) {
    this.#parent = parent;
    this.#chat = chat;
  }

  async render() {
    const chat = this.#chat;
    let avatar: string;
    if (chat.avatarPath !== "") {
      console.log(chat.avatarPath);
      avatar = serverHost + chat.avatarPath + "?" + Date.now();
    } else {
      avatar = "/assets/image/default-avatar.svg";
    }

    this.#parent.innerHTML = GroupChatInfoTemplate({ chat, avatar });

    const chatUsersList = this.#parent.querySelector("#users-list")!;
    const userCard = new ContactCard(chatUsersList);

    const ChatUsersId = await API.get<UsersIdRequest>(
      "/chat/" + chat.chatId + "/users",
    );
    if (ChatUsersId.usersId) {
      ChatUsersId.usersId.forEach(async (element) => {
        const userProfile = await API.get<ProfileResponse>(
          "/profile/" + element,
        );
        const user: TContact = {
          id: element,
          name: userProfile.name,
          avatarURL: userProfile.avatarURL,
          username: "",
        };
        userCard.render(user);
      });
    }

    const addUser = this.#parent.querySelector("#add-user")!;
    const handleAddUser = async () => {
      const modalWindow = this.#parent.querySelector("#modal-container")!;
      const userAddChat = new UserAddChat(modalWindow);
      const usersCount = this.#parent.querySelector("#users-count")!;
      userAddChat.render(this.#chat, chatUsersList, usersCount);
    };

    addUser.addEventListener("click", handleAddUser);

    const deleteGroupButton = this.#parent.querySelector("#delete-group")!;

    const handleDeleteGroup = async () => {
      const response = await API.delete(
        "/chat/" + chat.chatId + "/delete",
        chat.chatId,
      );
      if (!response.error) {
        Router.go("/");
      }
      console.log(response);
    };

    deleteGroupButton.addEventListener("click", handleDeleteGroup);

    const updateGroupButton = this.#parent.querySelector("#update-group")!;

    const handleGroupUpdate = () => {
      this.#parent.innerHTML = "";
      const groupUpdate = new GroupUpdate(this.#parent);
      groupUpdate.render(this.#chat);
    };
    updateGroupButton.addEventListener("click", handleGroupUpdate);
  }
}
