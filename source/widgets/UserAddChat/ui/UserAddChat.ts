import { TChat } from "@/entities/Chat";
import UserAddChatTemplate from "./UserAddChat.handlebars";
import "./UserAddChat.scss";
import { API } from "@/shared/api/api";
import {
  AddUserResponse,
  ContactResponse,
  ProfileResponse,
  UsersIdRequest,
} from "@/shared/api/types";
import { ContactCard } from "@/entities/ContactCard/ui/ContactCard";
import { TContact } from "@/entities/ContactCard";

export class UserAddChat {
  #parent;
  constructor(parent: Element) {
    this.#parent = parent;
  }

  async render(chat: TChat, chatUsersList: Element, usersCount: Element) {
    this.#parent.innerHTML = UserAddChatTemplate();

    const cancelBtn = this.#parent.querySelector("#cancel-btn")!;

    const handleCancelButton = () => {
      this.#parent.innerHTML = "";
    };

    cancelBtn.addEventListener("click", handleCancelButton);

    const contactListContainer =
      this.#parent.querySelector("#chat-contact-list")!;
    const response = await API.get<ContactResponse>("/contacts");
    console.log(response);
    if (!response.error) {
      const contacts = response.contacts;
      console.log(contacts)
      if (contacts && contacts.length) {
        contacts.forEach((elem) => {
          const contact = new ContactCard(contactListContainer);
          contact.render(elem);
        });
      }
    }

    const contactCardElement = document.querySelectorAll(".contact-card");
    contactCardElement.forEach((elem) => {
      elem.addEventListener("click", async (e) => {
        const usersId: string[] = [];
        if (elem instanceof HTMLAnchorElement) {
          const index = elem.href.lastIndexOf("/");
          const href = elem.href.slice(index + 1);
          usersId.push(href);
        }

        e.preventDefault();
        const response = await API.post<AddUserResponse, UsersIdRequest>(
          "/chat/" + chat.chatId + "/addusers",
          { usersId },
        );
        if (!response.error) {
          this.#parent.innerHTML = "";
          const ChatUsersId = await API.get<UsersIdRequest>(
            "/chat/" + chat.chatId + "/users",
          );
          console.log(ChatUsersId);
          if (ChatUsersId.usersId) {
            chatUsersList.innerHTML = "";
            const userCard = new ContactCard(chatUsersList);
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
            usersCount.innerHTML = ChatUsersId.usersId.length.toString();
          }
        }
      });
    });

    const handlerClickOutsideModal = (e: Event) => {
      if (e.target instanceof Element) {
        if (e.target.className === "add-user-to-chat") {
          this.#parent.innerHTML = "";
        }
      }
    };

    document.addEventListener("click", handlerClickOutsideModal);
  }
}
