import { API } from "@/shared/api/api";
import ChatInfoTemplate from "./ChatInfo.handlebars";
import "./ChatInfo.scss";
import { UserStorage } from "@/entities/User";
import { localHost } from "@/app/config";

export class ChatInfo {
    #parent;
    constructor(parent : Element) {
        this.#parent = parent;
    }

    async render() {
        const response = await API.get('/profile/' + UserStorage.getUser().id);
        response.avatarURL = localHost + response.avatarURL + "?" + Date.now();
        response.birthdate = response.birthdate.slice(0, 10);
        this.#parent.innerHTML = ChatInfoTemplate({response});
        console.log(this.#parent);
    }
}