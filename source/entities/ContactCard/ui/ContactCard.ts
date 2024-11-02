import ContactCardTemplate from "./ContactCard.handlebars";
import { TContact } from "../api/ContactType";
import "./ContactCard.scss";
import { serverHost } from "@/app/config";

export class ContactCard {
  #parent: Element;
  constructor(parent: Element) {
    this.#parent = parent;
  }

  render(contact: TContact) {
    contact.avatarURL = serverHost + contact.avatarURL;
    this.#parent.insertAdjacentHTML(
      "beforeend",
      ContactCardTemplate({ contact }),
    );
  }
}
