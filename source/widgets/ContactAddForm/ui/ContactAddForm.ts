import { API } from "@/shared/api/api";
import ContactAddFromTemplate from "./ContactAddForm.handlebars";
import "./ContactAddForm.scss";
import { ContactRequest } from "@/shared/api/types";
import { ContactCard } from "@/entities/ContactCard/ui/ContactCard";
import { TContact } from "@/entities/ContactCard";

export class ContactAddForm {
  #parent;
  #contactList;
  constructor(parent: Element, contactList: Element) {
    this.#parent = parent;
    this.#contactList = contactList;
  }

  render() {
    this.#parent.innerHTML = ContactAddFromTemplate();

    const confirmButton = this.#parent.querySelector("#confirm-btn")!;
    const usernameInput: HTMLInputElement =
      this.#parent.querySelector("#username-input")!;

    const handleAddContact = async () => {
      const contactUsername = usernameInput.value;
      const response = await API.post<TContact, ContactRequest>("/contacts", {
        contactUsername,
      });

      const spanError = this.#parent.querySelector("#error-span")!;

      if (!response.error) {
        spanError.textContent = "";
        const contactCard = new ContactCard(this.#contactList);
        contactCard.render(response);
        const contactCardElements = document.querySelectorAll(".contact-card")!;
        contactCardElements[contactCardElements.length - 1].addEventListener(
          "click",
          (e) => {
            e.preventDefault();
          },
        );
        spanError.textContent = "Контакт успешно добавлен";
        spanError.classList.add("not-error-span");
        spanError.classList.remove("error-span");
      }

      if (response.error) {
        spanError.classList.add("error-span");
        spanError.textContent = "Такой пользователь не найден";
        spanError.classList.remove("not-error-span");
      }
    };

    confirmButton.addEventListener("click", handleAddContact);

    const cancelButton = this.#parent.querySelector("#cancel-btn")!;

    const handleCancel = () => {
      this.#parent.innerHTML = "";
    };

    cancelButton.addEventListener("click", handleCancel);

    const handlerClickOutsideModal = (e: Event) => {
      if (e.target instanceof Element) {
        if (e.target.className === "contact-add") {
          this.#parent.innerHTML = "";
        }
      }
    };

    document.addEventListener("click", handlerClickOutsideModal);
  }
}
