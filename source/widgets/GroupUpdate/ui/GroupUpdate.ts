import { TChat } from "@/entities/Chat";
import GroupUpdateTempalte from "./GroupUpdate.handlebars";
import "./GroupUpdate.scss";
import { GroupChatInfo } from "@/widgets/GroupChatInfo";
import { localHost } from "@/app/config";

export class GroupUpdate {
    #parent;
    constructor(parent : Element) {
        this.#parent = parent;
    }

    render(chat : TChat) {
        let avatar : string;
        if (chat.avatarPath) {
            avatar = localHost + chat.avatarPath;
        }
        else {
            avatar = "/assets/image/default-avatar.svg";
        }
        
        this.#parent.innerHTML = GroupUpdateTempalte({chat, avatar});
        console.log(chat);
        const backButton = this.#parent.querySelector('#back-button')!;

        const handleBack = () => {
            this.#parent.innerHTML = '';
            const groupChatInfo = new GroupChatInfo(this.#parent, chat);
            groupChatInfo.render();
        };

        backButton.addEventListener('click', handleBack);

        const updateConfirmButton = this.#parent.querySelector('#confirm-update-group');

        const avatarInput : HTMLInputElement = this.#parent.querySelector('#group-ava')!;
        const avatarGroup : HTMLImageElement = this.#parent.querySelector('#avatar-group')!;
        let groupAvatar : File;

        console.log('zsda');

        const handleAvatar = () => {
            console.log('я туту');
            if (avatarInput.files) {
                const file = avatarInput.files[0];
                if (file) {
                avatarGroup.src = URL.createObjectURL(file);
                groupAvatar = file;
                }
            }
        };
        avatarInput.addEventListener("change", handleAvatar);

        const handleConfirmChanges = () => {
            const groupNameInput : HTMLInputElement = this.#parent.querySelector('#group-name')!;
            const groupName = groupNameInput.value;

            
            
        };
    }
}