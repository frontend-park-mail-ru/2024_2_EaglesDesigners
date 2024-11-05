import ContactCardTemplate from "./ContactCard.handlebars";
import { TContact } from "../api/ContactType";
import "./ContactCard.scss";
import { serverHost } from "@/app/config";
import { TChat } from "@/entities/Chat";
import { ChatResponse, ChatsResponse, ChatUsersResponse } from "@/shared/api/types";
import { API } from "@/shared/api/api";
import { Chat } from "@/widgets/Chat";
import { TNewChat } from "@/entities/Chat/model/type";

export class ContactCard {
  #parent;
  #chat;

  constructor(parent: Element, chat: Chat) {
    this.#parent = parent;
    this.#chat = chat;
  }

  async render(contact: TContact) {
    contact.avatarURL = serverHost + contact.avatarURL;
    this.#parent.insertAdjacentHTML(
      "beforeend",
      ContactCardTemplate({ contact }),
    );

    this.#parent.lastElementChild!.addEventListener("click", async (e) => {
      e.preventDefault();
    
      const response = await API.get<ChatUsersResponse>("/chats");
      if (!response.chats) {
        return;
      }
      const chats: TChat[] = response.chats ?? [];
    
      for (const elem of chats) {
        if (elem.chatType === 'personal') {
          const usersRes = await API.get<ChatsResponse>("/chat/" + elem.chatId + "/users");

          if (usersRes.usersId && usersRes.usersId.includes(contact.id)) {
            this.#chat.render(elem);
            return;
          }
        }
      }
  
      const newChat: TNewChat = {
        chatName: contact.name,
        chatType: 'personal',
        usersToAdd: [ contact.id ],
      }

      const formData: FormData = new FormData();
      const jsonProfileData = JSON.stringify(newChat);
      formData.append("chat_data", jsonProfileData);

      const newChatRes = await API.postFormData<ChatResponse>(
        "/addchat",
        formData,
      );

      this.#chat.render(newChatRes);    
    });
  }
}
