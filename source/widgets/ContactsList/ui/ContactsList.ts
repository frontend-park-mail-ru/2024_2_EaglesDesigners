import { API } from "@/shared/api/api";
import ContactsListTemplate from "./ContactsList.handlebars";
import { ContactResponse } from "@/shared/api/types";
import { ContactCard } from "@/entities/ContactCard/ui/ContactCard";
import { Router } from "@/shared/Router/Router";
import "./ContactsList.scss";
import { ContactAddForm } from "@/widgets/ContactAddForm/index.ts";

export class ContactsList {
  #parent;
  constructor(parent: Element) {
    this.#parent = parent;
  }

  async render() {
    this.#parent.innerHTML = ContactsListTemplate();

    const response = await API.get<ContactResponse>("/contacts");
    const contactList = this.#parent.querySelector("#contacts-list")!;
    const contactCard = new ContactCard(contactList);

    if (!response.error) {
      const contacts = response.contacts;

      if (contacts) {
        contacts.map((element) => {
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
