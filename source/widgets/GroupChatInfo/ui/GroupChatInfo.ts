import { API } from "@/shared/api/api";
import GroupChatInfoTemplate from "./GroupChatInfo.handlebars";
import "./GroupChatInfo.scss";
import { TChat } from "@/entities/Chat";

export class GroupChatInfo{
    #parent;
    #chat;
    constructor(parent : Element, chat : TChat){
        this.#parent = parent;
        this.#chat = chat;
    }

    render() {
        this.#parent.innerHTML = GroupChatInfoTemplate();
        
        const addUser = this.#parent.querySelector("#add-user")!;
        const groupUsers = this.#parent.querySelector('#users-list'); 
        const handleAddUser = async () => {
            const response = await API.post('/chat/' + this.#chat.chatId + "/addusers", {});
        };
        addUser.addEventListener('click', handleAddUser);
    }
}