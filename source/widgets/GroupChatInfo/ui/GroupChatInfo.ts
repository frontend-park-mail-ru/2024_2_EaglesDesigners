import { API } from "@/shared/api/api";
import GroupChatInfoTemplate from "./GroupChatInfo.handlebars";
import "./GroupChatInfo.scss";
import { TChat } from "@/entities/Chat";
import { UserAddChat } from "@/widgets/UserAddChat";
import { GroupUpdate } from "@/widgets/GroupUpdate/ui/GroupUpdate";
import { UsersIdResponse } from "@/shared/api/types";
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
      avatar = serverHost + chat.avatarPath;
    } else {
      avatar = "/assets/image/default-avatar.svg";
    }
    const ChatUsers = await API.get<UsersIdResponse>(
      "/chat/" + chat.chatId,
    );
    const usersCount = ChatUsers.users.length;

    this.#parent.innerHTML = GroupChatInfoTemplate({
      chat,
      avatar,
      usersCount,
    });

    const chatUsersList = this.#parent.querySelector("#users-list")!;
    const userCard = new ContactCard(chatUsersList);

    if (ChatUsers.users) {
        ChatUsers.users.forEach(async (element) => {
        const user: TContact = {
          id: element.id,
          name: element.name,
          avatarURL: element.avatarURL,
          username: element.username,
        };
        userCard.render(user);
        const lastChatUser = chatUsersList.lastElementChild;
        if (lastChatUser instanceof HTMLElement) {
          lastChatUser.style.pointerEvents = "none";
        }
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
