import { API } from "@/shared/api/api";
import ContactAddFromTemplate from "./ContactAddForm.handlebars";
import "./ContactAddForm.scss";
import { ContactRequest } from "@/shared/api/types";
import { ContactCard } from "@/entities/ContactCard/ui/ContactCard";
import { TContact } from "@/entities/ContactCard";
import { Chat } from "@/widgets/Chat";
import { ChatList } from "@/widgets/ChatList";
import { errors } from "@/shared/config/lang";

export class ContactAddForm {
  #parent;
  #chat;
  #contactList;
  #chatList;
  constructor(
    parent: Element,
    chat: Chat,
    contactList: Element,
    chatList: ChatList,
  ) {
    this.#parent = parent;
    this.#chat = chat;
    this.#contactList = contactList;
    this.#chatList = chatList;
  }

  render() {
    this.#parent.innerHTML = ContactAddFromTemplate();

    const confirmButton = this.#parent.querySelector("#confirm-btn")!;
    const usernameInput: HTMLInputElement =
      this.#parent.querySelector("#username-input")!;

    const handleAddContact = async () => {
      const contactUsername: ContactRequest = {
        contactUsername: usernameInput.value,
      };
      const response = await API.post<TContact, ContactRequest>(
        "/contacts",
        contactUsername,
      );

      const spanError = this.#parent.querySelector("#error-span")!;

      if (!response.error) {
        spanError.textContent = "";
        const contactCard = new ContactCard(this.#contactList);
        contactCard.renderChat(response, this.#chat, this.#chatList);
        const contactCardElements = document.querySelectorAll(".contact-card")!;
        contactCardElements[contactCardElements.length - 1].addEventListener(
          "click",
          (e) => {
            e.preventDefault();
          },
        );
        spanError.textContent = "Контакт успешно добавлен";
        spanError.classList.add("not-error-span");
        spanError.classList.remove("error-span");
      }

      if (response.error) {
        const message : string = errors[response.error] ?? errors["Default error"];
        spanError.textContent = message;
        spanError.classList.add("error-span");
        spanError.classList.remove("not-error-span");
      }
      
    };

    confirmButton.addEventListener("click", handleAddContact);

    const handleEnterClick = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleAddContact();
      }
      return;
    };

    usernameInput.addEventListener("keyup", handleEnterClick);

    const cancelButton = this.#parent.querySelector("#cancel-btn")!;

    const handleCancel = () => {
      this.#parent.innerHTML = "";
    };

    cancelButton.addEventListener("click", handleCancel);

    const handlerClickOutsideModal = (e: Event) => {
      if (e.target instanceof Element) {
        if (e.target.className === "contact-add") {
          this.#parent.innerHTML = "";
        }
      }
    };

    document.addEventListener("click", handlerClickOutsideModal);
  }
}
