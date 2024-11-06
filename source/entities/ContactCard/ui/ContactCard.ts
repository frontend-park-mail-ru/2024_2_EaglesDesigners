import ContactCardTemplate from "./ContactCard.handlebars";
import { TContact } from "../api/ContactType";
import "./ContactCard.scss";
import { serverHost } from "@/app/config";
import { TChat } from "@/entities/Chat";
import { ChatResponse, ChatsResponse, ChatUsersResponse } from "@/shared/api/types";
import { API } from "@/shared/api/api";
import { Chat } from "@/widgets/Chat";
import { TNewChat } from "@/entities/Chat/model/type";
import { SelectedContacts } from "@/widgets/AddGroupForm/lib/SelectedContacts";

export class ContactCard {
  #parent;
  #chat;

  constructor(parent: Element, chat: Chat) {
    this.#parent = parent;
    this.#chat = chat;
  }

  render(contact: TContact) {
    console.log(contact.avatarURL);
    contact.avatarURL = serverHost + contact.avatarURL;
    this.#parent.insertAdjacentHTML(
      "beforeend",
      ContactCardTemplate({ 
        contact }),
    );

    //this.#parent.lastElementChild!.style.pointerEvents = 'none';
    this.#parent.lastElementChild!.addEventListener('click', (event) => {
      event.preventDefault();    
    });
  }

  renderChat(contact: TContact) {
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

  renderForm(contact: TContact, selectedContacts: SelectedContacts) {
    contact.avatarURL = serverHost + contact.avatarURL;
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
