import { API } from "@/shared/api/api";
import GroupChatInfoTemplate from "./GroupChatInfo.handlebars";
import "./GroupChatInfo.scss";
import { TChat } from "@/entities/Chat";
import { AddUserResponse, UsersIdRequest } from "@/shared/api/types";
import { UserAddChat } from "@/widgets/UserAddChat/ui/UserAddChat";

export class GroupChatInfo{
    #parent;
    #chat;
    constructor(parent : Element, chat : TChat){
        this.#parent = parent;
        this.#chat = chat;
    }

    render() {
        const chat = this.#chat;
        this.#parent.innerHTML = GroupChatInfoTemplate({chat});
        
        const addUser = this.#parent.querySelector("#add-user")!;
        const groupUsers = this.#parent.querySelector('#users-list'); 
        const handleAddUser = async () => {
            // const usersId : string[] = [];
            // usersId.push("151e4ce9-9df1-428e-b82f-966d03090d95");
            // usersId.push("acd7cdc3-4839-450d-afe4-da16ef737004");
            // console.log('/chat/' + this.#chat.chatId + "/addusers");
            // const response = await API.post<AddUserResponse, UsersIdRequest>('/chat/' + this.#chat.chatId + "/addusers", {usersId});
            // console.log(response);
            const modalWindow = this.#parent.querySelector('#modal-container')!;
            const userAddChat = new UserAddChat(modalWindow);
            userAddChat.render(this.#chat.chatId); 

        };
        
        addUser.addEventListener('click', handleAddUser);

        const deleteGroupButton = this.#parent.querySelector('#delete-group')!;
        
        const handleDeleteGroup = async () => {
            const response = await API.delete('/chat/' + chat.chatId + "/delete", chat.chatId);
            console.log(response);
        };

        deleteGroupButton.addEventListener('click', handleDeleteGroup);
    }
}