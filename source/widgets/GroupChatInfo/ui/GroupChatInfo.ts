import { API } from "@/shared/api/api";
import GroupChatInfoTemplate from "./GroupChatInfo.handlebars";
import "./GroupChatInfo.scss";
import { TChat } from "@/entities/Chat";
import { UserAddChat } from "@/widgets/UserAddChat/ui/UserAddChat";
import { GroupUpdate } from "@/widgets/GroupUpdate/ui/GroupUpdate";

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
            const modalWindow = this.#parent.querySelector('#modal-container')!;
            const userAddChat = new UserAddChat(modalWindow);
            userAddChat.render(this.#chat); 

        };
        
        addUser.addEventListener('click', handleAddUser);

        const deleteGroupButton = this.#parent.querySelector('#delete-group')!;
        
        const handleDeleteGroup = async () => {
            const response = await API.delete('/chat/' + chat.chatId + "/delete", chat.chatId);
            console.log(response);
        };

        deleteGroupButton.addEventListener('click', handleDeleteGroup);

        const updateGroupButton = this.#parent.querySelector("#update-group")!;

        const handleGroupUpdate = () => {
            this.#parent.innerHTML = '';
            const groupUpdate = new GroupUpdate(this.#parent);
            groupUpdate.render(this.#chat);
        };
        updateGroupButton.addEventListener('click', handleGroupUpdate);
    }
}