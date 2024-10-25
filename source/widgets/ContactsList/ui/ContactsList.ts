import ContactsListTemplate from "./ContactsList.handlebars"

export class ContactsList {
    #parent
    constructor(parent : Element) {
        this.#parent = parent;
    }

    render() {
        this.#parent.innerHTML = ContactsListTemplate();
    }
}