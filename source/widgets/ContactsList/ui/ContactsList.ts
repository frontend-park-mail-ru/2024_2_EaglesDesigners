import { API } from "@/shared/api/api";
import ContactsListTemplate from "./ContactsList.handlebars";
import { ContactResponse } from "@/shared/api/types";
import { ContactCard } from "@/entities/ContactCard/ui/ContactCard";
import "./ContactsList.scss";
import { ContactAddForm } from "@/widgets/ContactAddForm/index.ts";
import { ChatList } from "@/widgets/ChatList";
import { Chat } from "@/widgets/Chat";

export class ContactsList {
  #parent;
  #chat;
  constructor(parent: Element, chat: Chat) {
    this.#parent = parent;
    this.#chat = chat;
  }

  async render() {
    this.#parent.innerHTML = ContactsListTemplate();

    const response = await API.get<ContactResponse>("/contacts");
    const contactList = this.#parent.querySelector("#contacts-list")!;
    const contactCard = new ContactCard(contactList);

    if (!response.error) {
      const contacts = response.contacts;

      if (contacts) {
        contacts.forEach((element) => {
          contactCard.render(element);
        });
      }
    }

    const backButton = this.#parent.querySelector("#back-button")!;

    const handleBack = () => {
      const chatList = new ChatList(this.#parent, this.#chat);
      chatList.render();
    };

    backButton.addEventListener("click", handleBack);

    const contactAdd = this.#parent.querySelector("#contact-add")!;

    const addContactButton = this.#parent.querySelector("#add-contact-button")!;

    const handleAddContact = () => {
      const ContactForm = new ContactAddForm(contactAdd, contactList);
      ContactForm.render();
    };

    addContactButton.addEventListener("click", handleAddContact);

    const contactCardElement = document.querySelectorAll(".contact-card");
    contactCardElement.forEach((elem) => {
      elem.addEventListener("click", (e) => {
        e.preventDefault();
      });
    });
  }
}
