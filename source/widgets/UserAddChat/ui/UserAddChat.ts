import { TChat } from "@/entities/Chat";
import UserAddChatTemplate from "./UserAddChat.handlebars";
import "./UserAddChat.scss";


export class UserAddChat {
    #parent;
    constructor(parent : Element) {
        this.#parent = parent;
    }

    render(chat : TChat) {
        this.#parent.innerHTML = UserAddChatTemplate();

        const cancelBtn = this.#parent.querySelector('#cancel-btn')!;

        const handleCancelButton = () => {
            this.#parent.innerHTML = '';
        };

        cancelBtn.addEventListener('click', handleCancelButton);

        const contactList = this.#parent.querySelector("#chat-contact-list");

    }
}