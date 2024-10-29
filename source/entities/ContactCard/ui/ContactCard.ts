import ContactCardTemplate from "./ContactCard.handlebars";
import { TContact } from "../api/ContactType";
import "./ContactCard.scss";

export class ContactCard {
  #parent: Element;
  constructor(parent: Element) {
    this.#parent = parent;
  }

  render(contact: TContact) {
    contact.avatarBase64 = "data:image/png;base64," + contact.avatarBase64;
    this.#parent.insertAdjacentHTML(
      "beforeend",
      ContactCardTemplate({ contact }),
    );
  }
}
