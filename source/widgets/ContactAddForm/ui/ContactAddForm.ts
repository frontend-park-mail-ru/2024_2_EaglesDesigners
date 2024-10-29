import { API } from "@/shared/api/api";
import ContactAddFromTemplate from "./ContactAddForm.handlebars";
import "./ContactAddForm.scss";
import { ContactResponse } from "@/shared/api/types";
import { ContactCard } from "@/entities/ContactCard/ui/ContactCard";
import { TContact } from "@/entities/ContactCard";

export class ContactAddForm {
    #parent;
    #contactList;
    constructor(parent : Element, contactList : Element) {
        this.#parent = parent;
        this.#contactList = contactList;
    }

    render() {
        this.#parent.innerHTML = ContactAddFromTemplate();


        const confirmButton = this.#parent.querySelector('#confirm-btn')!;
        const usernameInput : HTMLInputElement = this.#parent.querySelector('#username-input')!;
        console.log(usernameInput);
        
        

        const handleAddContact = async () => {
            const contactUsername = usernameInput.value;
            console.log(contactUsername);
            const response = await API.post<TContact, ContactResponse>('/contacts', {
                contactUsername,
            });
            
            const spanError = this.#parent.querySelector('#error-span')!;

            if (!response.error) {
                spanError.textContent = '';
                const contactCard = new ContactCard(this.#contactList);
                contactCard.render(response);
                const contactCardElements = document.querySelectorAll(".contact-card")!;
                contactCardElements[contactCardElements.length - 1].addEventListener('click', (e) => {
                    e.preventDefault();
                });
            }

            if (response.error) {
                spanError.textContent = "Такой пользователь не найден";
            }
        };

        confirmButton.addEventListener('click', handleAddContact);

        const cancelButton = this.#parent.querySelector('#cancel-btn')!;

        const handleCancel = () => {
            this.#parent.innerHTML = '';
        };

        cancelButton.addEventListener('click', handleCancel);

        //document.addEventListener('click', handleCancel);
    }
}