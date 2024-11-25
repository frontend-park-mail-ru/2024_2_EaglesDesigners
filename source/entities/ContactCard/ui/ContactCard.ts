import ContactCardTemplate from "./ContactCard.handlebars";
import { TContact } from "../api/ContactType";
import "./ContactCard.scss";
import { serverHost } from "@/app/config";
import { TChat } from "@/entities/Chat";
import {
  ChatResponse,
  ChatsResponse,
} from "@/shared/api/types";
import { API } from "@/shared/api/api";
import { Chat } from "@/widgets/Chat";
import { TNewChat } from "@/entities/Chat/model/type";
import { SelectedContacts } from "@/widgets/AddGroupForm/lib/SelectedContacts";
import { ChatList } from "@/widgets/ChatList";

export class ContactCard {
  #parent;

  constructor(parent: Element) {
    this.#parent = parent;
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
        contact,
      }),
    );

    this.#parent.lastElementChild!.addEventListener("click", (event) => {
      event.preventDefault();
    });
  }

  renderChat(contact: TContact, chat: Chat, chatList: ChatList) {
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
        if (elem.chatType === "personal") {
          const chatResponse = await API.get<ChatResponse>(
            `/chat/${elem.chatId}`,
          );
          if (chatResponse.users && (chatResponse.users.find(user => user.id === contact.id))) {
            chatList.render();
            chat.render(elem);
            return;
          }
        }
      }

      const newChat: TNewChat = {
        chatName: contact.name,
        chatType: "personal",
        usersToAdd: [contact.id],
      };

      const formData: FormData = new FormData();
      const jsonProfileData = JSON.stringify(newChat);
      formData.append("chat_data", jsonProfileData);

      const newChatRes = await API.postFormData<ChatResponse>(
        "/addchat",
        formData,
      );

      if (!newChatRes.error) {
        chatList.render();
        chat.render(newChatRes);
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
        },
      }),
    );

    const checkbox = this.#parent.lastElementChild!.querySelector(
      ".contact-card-checkbox",
    )!;
    const checkedIcon = checkbox.querySelector<HTMLElement>(
      ".contact-card-unchecked",
    )!;
    const uncheckedIcon = checkbox.querySelector<HTMLElement>(
      ".contact-card-checked",
    )!;

    this.#parent.lastElementChild!.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      selectedContacts.toggleCheckbox(contact.id);

      checkedIcon.style.display =
        checkedIcon.style.display === "none" ? "inline" : "none";
      uncheckedIcon.style.display =
        uncheckedIcon.style.display === "none" ? "inline" : "none";
    });
  }
}
