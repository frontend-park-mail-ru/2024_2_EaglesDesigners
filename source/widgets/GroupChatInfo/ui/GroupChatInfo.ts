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
import { UserType } from "@/widgets/AddChannelForm/lib/types";
import { UserStorage } from "@/entities/User";

export class GroupChatInfo {
  #parent;
  #chat;
  #userType;
  constructor(parent: Element, chat: TChat, userType : UserType) {
    this.#parent = parent;
    this.#chat = chat;
    this.#userType = userType;
  }

  async render() {
    const chat = this.#chat;
    const userType = this.#userType;
    let avatar: string;
    if (chat.avatarPath !== "") {
      avatar = serverHost + chat.avatarPath;
    } else {
      avatar = "/assets/image/default-avatar.svg";
    }
    const ChatUsers = await API.get<UsersIdResponse>(
      "/chat/" + chat.chatId,
    );
    let usersCount = 0;
    if ( ChatUsers?.users?.length) {
      usersCount = ChatUsers.users.length;
    }
    const chatType = {channel: false, group: false};
    if (chat.chatType == "group") {
      chatType.group = true;
    } else{
      chatType.channel = true;
    }
    this.#parent.innerHTML = GroupChatInfoTemplate({
      chat,
      chatType,
      avatar,
      usersCount,
      userType,
    });

    const chatUsersList = this.#parent.querySelector("#users-list")! || null;
    
    if (chatType.group) {
      
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
    }

    const addUser = this.#parent.querySelector("#add-user")!;
    const handleAddUser = async () => {
      const modalWindow = this.#parent.querySelector("#modal-container")!;
      const userAddChat = new UserAddChat(modalWindow);
      const usersCount = this.#parent.querySelector("#users-count")!;
      userAddChat.render(this.#chat, chatUsersList, usersCount);
    };

    if (chatType.group) {
      addUser.addEventListener("click", handleAddUser);
    }

    const deleteGroupButton : HTMLElement = this.#parent.querySelector("#delete-group")!;
    const handleDeleteGroup = async () => {
      if (userType.owner) {
        const response = await API.delete(
          "/chat/" + chat.chatId + "/delete",
          chat.chatId,
        );
        if (!response.error) {
          Router.go("/");
        }
        return; 
        
      }
      else {
        console.log(UserStorage.getUser().id);
        const response = await API.delete("/chat/" + chat.chatId + "/leave", "");
        if (!response.error) {
          console.log(response);
          Router.go("/");
        }
      }
    };

    deleteGroupButton.addEventListener("click", handleDeleteGroup);

    const handleSubscribe = async () => {
      const responseSubscribe = await API.post("/chat/" + this.#chat.chatId + "/addusers", {"usersId": [UserStorage.getUser().id]});
      console.log(responseSubscribe);
      if (!responseSubscribe.error) {
        this.#parent.innerHTML = '';
      }
    };
    if (usersCount === 0 && chatType.channel) {
      deleteGroupButton.style.display = "none";
      const subscribeButton : HTMLElement = this.#parent.querySelector("#subscribe-channel")!;
      subscribeButton.style.display = "block";
      console.log(subscribeButton);
      subscribeButton.addEventListener("click", handleSubscribe);
    }

    const updateGroupButton = this.#parent.querySelector("#update-group")!;

    const handleGroupUpdate = () => {
      this.#parent.innerHTML = "";
      const groupUpdate = new GroupUpdate(this.#parent, userType);
      groupUpdate.render(this.#chat);
    };

    if (userType.owner) {
      updateGroupButton.addEventListener("click", handleGroupUpdate);
    }
    
  }
}
