import { API } from "@/shared/api/api";
import GroupChatInfoTemplate from "./GroupChatInfo.handlebars";
import "./GroupChatInfo.scss";
import { TChat } from "@/entities/Chat";
import { UserAddChat } from "@/widgets/UserAddChat";
import { GroupUpdate } from "@/widgets/GroupUpdate/ui/GroupUpdate";
import { EmptyRequest, NotificationResponse, UsersIdResponse } from "@/shared/api/types";
import { ContactCard } from "@/entities/ContactCard/ui/ContactCard";
import { TContact } from "@/entities/ContactCard";
import { Router } from "@/shared/Router/Router";
import { serverHost } from "@/app/config";
import { UserType } from "@/widgets/AddChannelForm/lib/types";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { formatBytes } from "@/shared/helpers/formatBytes";

export class GroupChatInfo {
  #parent;
  #chat;
  #userType;
  constructor(parent: HTMLElement, chat: TChat, userType : UserType) {
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
      `/chat/${chat.chatId}`,
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

    const files = [
                  {
                      "url": "/files/675f466313dbaf51a93aa2e1",
                      "filename": "Технопарк. Ведомость. WEB. Весна 2024 - Модуль 1.pdf",
                      "size": 73677
                  },
                  {
                      "url": "/files/675f466313dbaf51a93aa2e4",
                      "filename": ".~lock.Lecture5 (1).pptx#",
                      "size": 109
                  }
              ];

    const photos = [
                {
                    "url": "/files/675f473513dbaf51a93aa2e7",
                    "filename": "9d5b031369cec9acdc54614a4d928d8e.jpg",
                    "size": 904891
                },
                {
                    "url": "/files/675f473513dbaf51a93aa2ec",
                    "filename": "s-l500.jpg",
                    "size": 13863
                }
            ];

    const extentionRegex = /\.([^.]+)$/;
    const nameRegex = /^(.+)\.[^.]+$/;
      
    this.#parent.innerHTML = GroupChatInfoTemplate({
      chat: {
        ...chat,
        files: files ? files.map(file => ({
          url: `${serverHost}${file.url}`,
          name: nameRegex.exec(file.filename)![1],
          extention: extentionRegex.exec(file.filename)![1].toUpperCase(),
          size: formatBytes(file.size),
      })) : [],
        photos: photos ? photos.map(photo => ({
          url: `${serverHost}${photo.url}`
        })) : [],
      },
      chatType,
      avatar,
      usersCount,
      userType,
    });

    const usersButton = this.#parent.querySelector<HTMLElement>("#group-content-users")!;
    const photosButton = this.#parent.querySelector<HTMLElement>("#group-content-photos")!;
    const filesButton = this.#parent.querySelector<HTMLElement>("#group-content-files")!;

    const contentImport = this.#parent.querySelector<HTMLElement>("#content-tabs")!;

    if(chatType.group) {
      usersButton?.addEventListener('click', () => {
        contentImport.style.transform = `translateX(0%)`;
      });
      photosButton?.addEventListener('click', () => {
        contentImport.style.transform = `translateX(-100%)`;
      });
      filesButton?.addEventListener('click', () => {
        contentImport.style.transform = `translateX(-200%)`;
      });  
    }else {
      photosButton?.addEventListener('click', () => {
        contentImport.style.transform = `translateX(0%)`;
      });
      filesButton?.addEventListener('click', () => {
        contentImport.style.transform = `translateX(-100%)`;
      });   
    }

    const chatUsersList = this.#parent.querySelector("#users-list")!;
    
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
          `/chat/${chat.chatId}/delete`,
          chat.chatId,
        );
        if (!response.error) {
          Router.go("/");
        }
        return; 
        
      }
      else {
        const response = await API.delete(`/chat/${chat.chatId}/leave`, "");
        if (!response.error) {
          Router.go("/");
        }
      }
    };
    if (deleteGroupButton) {
      deleteGroupButton.addEventListener("click", handleDeleteGroup);
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

    this.#parent.querySelector('#group-info-close-button')!.addEventListener('click', () => {
      this.#parent.style.right = '-100vw';
      this.#parent.innerHTML = '';
    });
    
    this.#parent.style.right = '0';

    const notificationToggle = this.#parent.querySelector("#notification-toggle")!;
    const notificationCheckbox : HTMLInputElement = this.#parent.querySelector("#toggle")!;
    if (ChatStorage.getChat().send_notifications) {
      notificationCheckbox.checked = true;
      notificationToggle.checked = true;
    }


    const handleNotification = async () => {
      const responseNotification : boolean = await API.post<NotificationResponse, EmptyRequest>(`/chat/${ChatStorage.getChat().chatId}/notifications/${!notificationCheckbox.checked}`, {});
      ChatStorage.getChat().send_notifications = responseNotification;
    };

    notificationToggle.addEventListener("click", handleNotification);
  }
}
