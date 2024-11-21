import { API } from "@/shared/api/api";
import ContactsListTemplate from "./ContactsList.handlebars";
import { ContactResponse, searchContactsResponse } from "@/shared/api/types";
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
    const contactList : HTMLElement = this.#parent.querySelector("#contacts-list")!;
    const contactCard = new ContactCard(contactList);
    const chatList = new ChatList(this.#parent, this.#chat);

    if (!response.error) {
      const contacts = response.contacts;
      if (contacts) {
        contacts.forEach((element) => {
          contactCard.renderChat(element, this.#chat, chatList);
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
      const ContactForm = new ContactAddForm(
        contactAdd,
        this.#chat,
        contactList,
        chatList,
      );
      ContactForm.render();
    };

    addContactButton.addEventListener("click", handleAddContact);

    const inputSearch : HTMLInputElement = this.#parent.querySelector("#search-input")!;

    const handleSearch = async (event) => {
      console.log(event);
      const searchContacts : HTMLElement = this.#parent.querySelector("#contacts-list-search")!;
      const globalUsers = this.#parent.querySelector("#global-users")!;
      const userContacts = this.#parent.querySelector("#user-contacts")!;
      userContacts.innerHTML = '';
      globalUsers.innerHTML = '';

      const contactName : string = inputSearch.value;
        if (contactName != "") {
          const response = await API.get<searchContactsResponse>("/contacts/search" + "?key_word=" + contactName);
          if (!response.error) {
            contactList.style.display = "none";
            searchContacts.style.display = "block";
            if (response.global_users) {
              console.log(globalUsers, "global");
              response.global_users.forEach((element) => {
                const contactGlobal = new ContactCard(globalUsers);
                contactGlobal.renderChat(element, this.#chat, chatList);
              });
            }
            if (response.user_contacts) {
              console.log(response);
              response.user_contacts.forEach((element) => {
                const contactSearch = new ContactCard(userContacts);
                contactSearch.renderChat(element, this.#chat, chatList);
              });
            }
            console.log(response);
          }
        }
        else {
          contactList.style.display = "block";
          searchContacts.style.display = "none";
        }
        return;
    };
    const debouncedHandle = debounce(handleSearch, 250);

    inputSearch.addEventListener("input", debouncedHandle);
  }
}

function debounce(callee : Function, timeoutMs : number) {
  console.log(typeof callee)
  return function perform(...args) {
    const previousCall = this.lastCall;

    this.lastCall = Date.now();

    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer);
    }

    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
  };
}