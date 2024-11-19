import MessageMenuTemplate from "./MessageMenu.handlebars";
import "./MessageMenu.scss";

export class MessageMenu {
    #parent;
    constructor(parent : Element) {
        this.#parent = parent;
    }

    render() {
        this.#parent.innerHTML = MessageMenuTemplate();
    }
}