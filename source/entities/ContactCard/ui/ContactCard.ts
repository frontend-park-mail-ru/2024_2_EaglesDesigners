import ContactCardTemplate from "./ContactCard.handlebars";
import { TContact } from "../api/ContactType";
import "./ContactCard.scss";

export class ContactCard {
    #parent : Element;
    constructor(parent : Element) {
        this.#parent = parent;
    }

    render(contact : TContact) {
        this.#parent.insertAdjacentHTML("beforeend", ContactCardTemplate({contact}));
    }
}
