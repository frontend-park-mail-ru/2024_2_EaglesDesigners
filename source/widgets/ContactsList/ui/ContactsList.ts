import { API } from "@/shared/api/api";
import ContactsListTemplate from "./ContactsList.handlebars";
import { ContactRequest } from "@/shared/api/types";
import { ContactCard } from "@/entities/ContactCard/ui/ContactCard";
import { Router } from "@/shared/Router/Router";
import "./ContactsList.scss";

export class ContactsList {
  #parent;
  constructor(parent: Element) {
    this.#parent = parent;
  }

  async render() {
    this.#parent.innerHTML = ContactsListTemplate();

    const response = await API.get<ContactRequest>("/contacts");
    console.log(this.#parent);
    const contactList = this.#parent.querySelector("#contacts-list")!;
    console.log(contactList);
    const contactCard = new ContactCard(contactList);

    if (!response.error) {
      const contacts = response.contacts;

      contacts.map((element) => {
        element.avatarBase64 = "data:image/png;base64," + element.avatarBase64;
        contactCard.render(element);
      });
    }

    const backButton = this.#parent.querySelector("#back-button")!;

    const handleBack = () => {
      Router.go("/");
    };

    backButton.addEventListener("click", handleBack);
  }
}
