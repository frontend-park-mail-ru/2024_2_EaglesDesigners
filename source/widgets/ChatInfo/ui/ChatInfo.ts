import { API } from "@/shared/api/api";
import ChatInfoTemplate from "./ChatInfo.handlebars";
import "./ChatInfo.scss";
import { UserStorage } from "@/entities/User";
import { localHost } from "@/app/config";
import { TChat } from "@/entities/Chat";

export class ChatInfo {
    #parent;
    #chat;
    constructor(parent : Element, chat : TChat) {
        this.#parent = parent;
        this.#chat = chat;
    }

    async render() {
        const response = await API.get('/profile/' + UserStorage.getUser().id);
        response.avatarURL = localHost + response.avatarURL + "?" + Date.now();
        response.birthdate = response.birthdate.slice(0, 10);
        this.#parent.innerHTML = ChatInfoTemplate({response});

        const deleteChatButton = this.#parent.querySelector('#delete-chat')!;

        const handleDeleteGroup = async () => {
            const response = await API.delete('/chat/' + this.#chat.chatId + "/delete", this.#chat.chatId);
            console.log(response);
        };

        deleteChatButton.addEventListener('click', handleDeleteGroup);
    }
}