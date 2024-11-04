import { TChat } from "@/entities/Chat";
import UserAddChatTemplate from "./UserAddChat.handlebars";
import "./UserAddChat.scss";
import { API } from "@/shared/api/api";
import { AddUserResponse, ContactResponse, UsersIdRequest } from "@/shared/api/types";
import { ContactCard } from "@/entities/ContactCard/ui/ContactCard";


export class UserAddChat {
    #parent;
    constructor(parent : Element) {
        this.#parent = parent;
    }

    async render(chat : TChat) {
        this.#parent.innerHTML = UserAddChatTemplate();

        const cancelBtn = this.#parent.querySelector('#cancel-btn')!;

        const handleCancelButton = () => {
            this.#parent.innerHTML = '';
        };

        cancelBtn.addEventListener('click', handleCancelButton);

        const contactListContainer = this.#parent.querySelector("#chat-contact-list")!;
        const response = await API.get<ContactResponse>('/contacts');
        if (!response.error){ 
            const contacts = response.contacts;
            if (contacts.length) {
                contacts.map( (elem) => {
                    const contact = new ContactCard(contactListContainer);
                    contact.render(elem);
                });
            }
        }

        const contactCardElement = document.querySelectorAll(".contact-card");
        contactCardElement.forEach((elem) => {
        elem.addEventListener("click", async (e) => {
            const usersId : string[] = [];
            if (elem instanceof HTMLAnchorElement) {
                console.log(elem.href);
                const index = elem.href.lastIndexOf('/');
                const href = elem.href.slice(index+1);
                usersId.push(href);
                console.log(usersId);
            }
            
            
            e.preventDefault();
            console.log(chat.chatId);
            const response = await API.post<AddUserResponse, UsersIdRequest>('/chat/' + chat.chatId + "/addusers", {usersId});
            if (!response.error) {
                this.#parent.innerHTML = '';
            }
            
        });
        });

    }
}