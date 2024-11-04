import { ProfileResponse } from "@/shared/api/types";
import ChatUserCardTemplate from "./ChatUserCard.handlebars";
import "./ChatUserCard.scss";
import { localHost } from "@/app/config";

export class ChatUserCard {
    #parent;
    constructor(parent : Element) {
        this.#parent = parent;
    }

    render(userProfile : ProfileResponse) {
        userProfile.avatarURL = localHost + userProfile.avatarURL;
        this.#parent.insertAdjacentHTML('beforeend', ChatUserCardTemplate({userProfile}));
    }
}