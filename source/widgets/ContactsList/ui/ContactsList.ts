import { API } from "@/shared/api/api";
import ContactsListTemplate from "./ContactsList.handlebars";
import { ContactResponse, searchContactsResponse } from "@/shared/api/types";
import { ContactCard } from "@/entities/ContactCard/ui/ContactCard";
import "./ContactsList.scss";
import { ContactAddForm } from "@/widgets/ContactAddForm/index.ts";
import { ChatList } from "@/widgets/ChatList";
import { Chat } from "@/widgets/Chat";
import { debounce } from "@/shared/helpers/debounce";

export class ContactsList {
  #parent;
  #chat;
  constructor(parent: HTMLElement, chat: Chat) {
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

    const handleSearch = async () => {
      const searchContacts : HTMLElement = this.#parent.querySelector("#contacts-list-search")!;
      const globalUsers = this.#parent.querySelector("#global-users")!;
      const userContacts = this.#parent.querySelector("#user-contacts")!;
      userContacts.innerHTML = '';
      globalUsers.innerHTML = '';

      const contactName : string = inputSearch.value;
        if (contactName != "") {
          const labelUserContacts : HTMLElement = this.#parent.querySelector("#label-user-contacts")!;
          const labelGlobalContacts : HTMLElement = this.#parent.querySelector("#label-global-contacts")!;

          const response = await API.get<searchContactsResponse>(`/contacts/search?key_word=${contactName}`);
          if (!response.error) {
            contactList.classList.remove('block');
            contactList.classList.add("hidden");
            searchContacts.classList.remove('hidden');
            searchContacts.classList.add('block');
            if (response.global_users) {
              labelGlobalContacts.classList.remove('hidden');
              labelGlobalContacts.classList.add('block');
              response.global_users.forEach((element) => {
                const contactGlobal = new ContactCard(globalUsers);
                contactGlobal.renderChat(element, this.#chat, chatList);
              });
            }
            else {
              labelGlobalContacts.classList.remove("block");
              labelGlobalContacts.classList.add("hidden");
            }
            if (response.user_contacts) {
              labelUserContacts.classList.add("block");
              labelUserContacts.classList.remove("hidden");
              response.user_contacts.forEach((element) => {
                const contactSearch = new ContactCard(userContacts);
                contactSearch.renderChat(element, this.#chat, chatList);
              });
            }
            else {
              labelUserContacts.classList.add("hidden");
              labelUserContacts.classList.remove("block");
              labelUserContacts.style.display = "none";
            }
          }
        }
        else {
          contactList.classList.add("block");
          contactList.classList.remove("hidden");
          searchContacts.classList.add("hidden");
          searchContacts.classList.remove("block");
        }
        return;
    };
    const debouncedHandle = debounce(handleSearch, 250);

    inputSearch.addEventListener("input", debouncedHandle);

    document.querySelector<HTMLElement>('#chat-info-container')!.style.right = '-100vw'; 
    this.#parent.style.left = '0';

  }
}
