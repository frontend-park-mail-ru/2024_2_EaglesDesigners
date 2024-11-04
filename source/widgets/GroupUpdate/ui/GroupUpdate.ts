import { TChat } from "@/entities/Chat";
import GroupUpdateTempalte from "./GroupUpdate.handlebars";
import "./GroupUpdate.scss";
import { GroupChatInfo } from "@/widgets/GroupChatInfo";

export class GroupUpdate {
    #parent;
    constructor(parent : Element) {
        this.#parent = parent;
    }

    render(chat : TChat) {
        this.#parent.innerHTML = GroupUpdateTempalte();
        const backButton = this.#parent.querySelector('#back-button')!;

        const handleBack = () => {
            this.#parent.innerHTML = '';
            const groupChatInfo = new GroupChatInfo(this.#parent, chat);
            groupChatInfo.render();
        };

        backButton.addEventListener('click', handleBack);
    }
}