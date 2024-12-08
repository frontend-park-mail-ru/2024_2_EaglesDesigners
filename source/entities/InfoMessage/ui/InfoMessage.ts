import { TChatMessage } from "@/entities/ChatMessage";
import InfoMessageTemplate from "./InfoMessage.handlebars";
import "./InfoMessage.scss";

export class InfoMessage {
    #parent;
    constructor (parent : HTMLElement) {
        this.#parent = parent;
    }

    render(message : TChatMessage) {
        this.#parent.insertAdjacentHTML("beforeend", InfoMessageTemplate({message}));
    }
}