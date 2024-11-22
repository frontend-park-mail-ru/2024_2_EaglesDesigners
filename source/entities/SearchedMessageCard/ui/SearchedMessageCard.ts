import { TChatMessage } from "@/entities/ChatMessage";
import SearchedMessageCardTempalte from "./SearchedMessageCard.handlebars";
import { serverHost } from "@/app/config";
import { getTimeString } from "@/shared/helpers/getTimeString";

export class SearchedMessageCard{
    #parent;
    constructor(parent : HTMLElement){
        this.#parent = parent;
    }

    render(message : TChatMessage, avatar : string, person : string) {
        message.datetime = getTimeString(message.datetime);
        console.log(this.#parent);
        if (avatar) {
            avatar = serverHost + avatar;
        }
        const messageResult = SearchedMessageCardTempalte({message, avatar, person});
        this.#parent.insertAdjacentHTML("beforeend", messageResult);
        this.#parent.lastElementChild?.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            console.log("hi");
        });
    }
}