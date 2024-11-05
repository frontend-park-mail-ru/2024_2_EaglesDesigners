import { API } from "@/shared/api/api";
import ContactsListTemplate from "./ContactsList.handlebars";
import { ContactRequest } from "@/shared/api/types";
import { ContactCard } from "@/entities/ContactCard/ui/ContactCard";
import { Router } from "@/shared/Router/Router";
import "./ContactsList.scss";
import { ContactAddForm } from "@/widgets/ContactAddForm/index.ts";
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

    const response = await API.get<ContactRequest>("/contacts");
    const contactList = this.#parent.querySelector("#contacts-list")!;
    const contactCard = new ContactCard(contactList, this.#chat);

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
      Router.go("/");
    };

    backButton.addEventListener("click", handleBack);

    const contactAdd = this.#parent.querySelector("#contact-add")!;

    const addContactButton = this.#parent.querySelector("#add-contact-button")!;

    const handleAddContact = () => {
      const ContactForm = new ContactAddForm(contactAdd, this.#chat,contactList);
      ContactForm.render();
    };

    addContactButton.addEventListener("click", handleAddContact);
  }
}
