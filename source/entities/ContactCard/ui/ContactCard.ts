import ContactCardTemplate from "./ContactCard.handlebars";
import { TContact } from "../api/ContactType";
import "./ContactCard.scss";
import { serverHost } from "@/app/config";
import { TChat } from "@/entities/Chat";
import { ChatsResponse, ChatUsersResponse } from "@/shared/api/types";
import { API } from "@/shared/api/api";
import { Chat } from "@/widgets/Chat";
import { TNewChat } from "@/entities/Chat/model/type";
import { SelectedContacts } from "@/widgets/AddGroupForm/lib/SelectedContacts";
import { ChatList } from "@/widgets/ChatList";

export class ContactCard {
  #parent;
  #chat;

  constructor(parent: Element, chat: Chat) {
    this.#parent = parent;
    this.#chat = chat;
  }

  render(contact: TContact) {
    if (contact.avatarURL !== null) {
      contact.avatarURL = serverHost + contact.avatarURL;
    } else {
      contact.avatarURL = "/assets/image/default-avatar.svg";
    }
    this.#parent.insertAdjacentHTML(
      "beforeend",
      ContactCardTemplate({ 
        contact }),
    );

    this.#parent.lastElementChild!.addEventListener('click', (event) => {
      event.preventDefault();    
    });
  }

  renderChat(contact: TContact, chatListInstance: ChatList) {
    if (contact.avatarURL !== null) {
      contact.avatarURL = serverHost + contact.avatarURL;
    } else {
      contact.avatarURL = "/assets/image/default-avatar.svg";
    }

    this.#parent.insertAdjacentHTML(
      "beforeend",
      ContactCardTemplate({ contact }),
    );

    this.#parent.lastElementChild!.addEventListener("click", async (e) => {
      e.preventDefault();
    
      const response = await API.get<ChatsResponse>("/chats");
      if (!response.chats) {
        return;
      }
      const chats: TChat[] = response.chats ?? [];
    
      for (const elem of chats) {
        if (elem.chatType === 'personal') {
          const usersRes = await API.get<ChatUsersResponse>("/chat/" + elem.chatId + "/users");

          if (usersRes.usersId && usersRes.usersId.includes(contact.id)) {
            chatListInstance.render();
            this.#chat.render(elem);
            return;
          }
        }
      }
  
      const newChat: TNewChat = {
        chatName: contact.username,
        chatType: 'personal',
        usersToAdd: [ contact.id ],
      };

      const formData: FormData = new FormData();
      const jsonProfileData = JSON.stringify(newChat);
      formData.append("chat_data", jsonProfileData);

      const newChatRes = await API.postFormData<TChat>(
        "/addchat",
        formData,
      );
      if(!newChatRes.error){
        chatListInstance.render();
        this.#chat.render(newChatRes);    
        }
    });
  }

  renderForm(contact: TContact, selectedContacts: SelectedContacts) {
    if (contact.avatarURL) {
      contact.avatarURL = serverHost + contact.avatarURL;
    } else {
      contact.avatarURL = "/assets/image/default-avatar.svg";
    }
    this.#parent.insertAdjacentHTML(
      "beforeend",
      ContactCardTemplate({ 
        contact: {
          ...contact,
          form: true, 
        }}),
    );

    const checkbox = this.#parent.lastElementChild!.querySelector('.contact-card-checkbox')!;
    const checkedIcon = checkbox.querySelector('.contact-card-unchecked')!;
    const uncheckedIcon = checkbox.querySelector('.contact-card-checked')!;

    this.#parent.lastElementChild!.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      
      selectedContacts.toggleCheckbox(contact.id);

      checkedIcon.style.display = checkedIcon.style.display === 'none' ? 'inline' : 'none';
      uncheckedIcon.style.display = uncheckedIcon.style.display === 'none' ? 'inline' : 'none';
    });
  }
}
