export class SelectedContacts {
  #selectedContacts: string[];

  constructor() {
    this.#selectedContacts = [];
  }

  getSelectedContacts() {
    return this.#selectedContacts;
  }

  toggleCheckbox(contactId: string) {
    if (this.#selectedContacts.includes(contactId)) {
      this.#selectedContacts = this.#selectedContacts.filter(
        (id) => id !== contactId,
      );
    } else {
      this.#selectedContacts = [...this.#selectedContacts, contactId];
    }
  }
}
