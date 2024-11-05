import { API } from "@/shared/api/api";
import ChatInfoTemplate from "./ChatInfo.handlebars";
import "./ChatInfo.scss";
import { UserStorage } from "@/entities/User";
import { localHost } from "@/app/config";
import { TChat } from "@/entities/Chat";
import { ProfileResponse, UsersIdRequest, UsersIdResponse } from "@/shared/api/types";

export class ChatInfo {
    #parent;
    #chat;
    constructor(parent : Element, chat : TChat) {
        this.#parent = parent;
        this.#chat = chat;
    }

    async render() {
        console.log(this.#chat);
        const usersId = await API.get<UsersIdResponse>('/chat/' + this.#chat.chatId + "/users");
        console.log(usersId, UserStorage.getUser().id)
        let userId;
        if ( usersId.usersId[0] !== UserStorage.getUser().id) {
            userId = usersId.usersId[0];
        } 
        else {
            userId = usersId.usersId[1];
        }
        const profileUser = await API.get<ProfileResponse>('/profile/' + userId);
        if (profileUser.avatarURL) {
            profileUser.avatarURL = localHost + profileUser.avatarURL + "?" + Date.now();
        }
        if (profileUser.birthdate) {
            const birthdate = profileUser.birthdate.toString().slice(0, 10);
            profileUser.birthdate = birthdate;
        }
        this.#parent.innerHTML = ChatInfoTemplate({profileUser});

        const deleteChatButton = this.#parent.querySelector('#delete-chat')!;

        const handleDeleteGroup = async () => {
            const response = await API.delete('/chat/' + this.#chat.chatId + "/delete", this.#chat.chatId);
            console.log(response);
        };

        deleteChatButton.addEventListener('click', handleDeleteGroup);
    }
}