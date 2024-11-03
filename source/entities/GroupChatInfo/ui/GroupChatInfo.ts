import GroupChatInfoTemplate from "./GroupChatInfo.handlebars";
import "./GroupChatInfo.scss";

export class GroupChatInfo{
    #parent;
    constructor(parent : Element){
        this.#parent = parent;
    }

    render() {
        this.#parent.innerHTML = GroupChatInfoTemplate();
    }
}