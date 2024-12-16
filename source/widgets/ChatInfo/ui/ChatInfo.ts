import { API } from "@/shared/api/api";
import ChatInfoTemplate from "./ChatInfo.handlebars";
import "./ChatInfo.scss";
import { UserStorage } from "@/entities/User";
import { serverHost } from "@/app/config";
import { TChat } from "@/entities/Chat";
import { ProfileResponse, UsersIdResponse } from "@/shared/api/types";
import { Router } from "@/shared/Router/Router";
import * as moment from "moment";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { formatBytes } from "@/shared/helpers/formatBytes";

export class ChatInfo {
  #parent;
  #chat;
  constructor(parent: HTMLElement, chat: TChat) {
    this.#parent = parent;
    this.#chat = chat;
  }

  async render() {
    const usersInChat = await API.get<UsersIdResponse>(
      `/chat/${this.#chat.chatId}`,
    );
    let user;
    if (usersInChat.users) {
      user = usersInChat.users[(usersInChat.users[0].id !== UserStorage.getUser().id) ? 0 : 1];
      const profileUser = await API.get<ProfileResponse>(`/profile/${user.id}`);
      let birthdate;
      if (profileUser.birthdate) {
        birthdate= moment(profileUser.birthdate)
        .utc()
        .format("DD.MM.YYYY");
      }
       
      if (profileUser.avatarURL) {
        profileUser.avatarURL = serverHost + profileUser.avatarURL;
      } else {
        profileUser.avatarURL = "/assets/image/default-avatar.svg";
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

      this.#parent.innerHTML = ChatInfoTemplate({ profileUser, birthdate,
        chat: {
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
       });

      const photosButton = this.#parent.querySelector<HTMLElement>("#group-content-photos")!;
      const filesButton = this.#parent.querySelector<HTMLElement>("#group-content-files")!;

      const contentImport = this.#parent.querySelector<HTMLElement>("#content-tabs")!;

      photosButton?.addEventListener('click', () => {
      contentImport.style.transform = `translateX(0%)`;
      });
      filesButton?.addEventListener('click', () => {
      contentImport.style.transform = `translateX(-100%)`;
      });   

      const deleteChatButton = this.#parent.querySelector("#delete-chat")!;

      const handleDeleteGroup = async () => {
        const response = await API.delete(
          `/chat/${this.#chat.chatId}/delete`,
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

    const notificationToggle = this.#parent.querySelector("#notification-toggle")!;
    const notificationCheckbox : HTMLInputElement = this.#parent.querySelector("#toggle")!;
    if (ChatStorage.getChat().send_notifications) {
      notificationCheckbox.checked = true;
      notificationToggle.checked = true;
    }


    const handleNotification = async () => {
      await API.post(`/chat/${ChatStorage.getChat().chatId}/notifications/${!notificationCheckbox.checked}`, {});
    };

    notificationToggle.addEventListener("click", handleNotification);
  }
}
