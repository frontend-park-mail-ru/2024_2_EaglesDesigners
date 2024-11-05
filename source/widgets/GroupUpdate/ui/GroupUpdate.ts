import { TChat } from "@/entities/Chat";
import GroupUpdateTempalte from "./GroupUpdate.handlebars";
import "./GroupUpdate.scss";
import { GroupChatInfo } from "@/widgets/GroupChatInfo";
import { serverHost } from "@/app/config";
import { GroupUpdateRequest, GroupUpdateResponse } from "@/shared/api/types";
import { API } from "@/shared/api/api";
import { Router } from "@/shared/Router/Router";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";

export class GroupUpdate {
  #parent;
  constructor(parent: Element) {
    this.#parent = parent;
  }

  render(chat: TChat) {
    let avatar: string;
    if (chat.avatarPath !== "") {
      avatar = serverHost + chat.avatarPath + "?" + Date.now();
    } else {
      avatar = "/assets/image/default-avatar.svg";
    }

    this.#parent.innerHTML = GroupUpdateTempalte({ chat, avatar });
    const backButton = this.#parent.querySelector("#back-button")!;

    const handleBack = () => {
      this.#parent.innerHTML = "";
      const groupChatInfo = new GroupChatInfo(this.#parent, chat);
      groupChatInfo.render();
    };

    backButton.addEventListener("click", handleBack);

    const avatarInput: HTMLInputElement =
      this.#parent.querySelector("#group-ava")!;
    const avatarGroup: HTMLImageElement =
      this.#parent.querySelector("#avatar-group")!;
    let groupAvatarFile: File;

    const handleAvatar = () => {
      if (avatarInput.files) {
        const file = avatarInput.files[0];
        if (file) {
          avatarGroup.src = URL.createObjectURL(file);
          groupAvatarFile = file;
        }
      }
    };
    avatarInput.addEventListener("change", handleAvatar);

    const updateConfirmButton = this.#parent.querySelector(
      "#confirm-update-group",
    )!;
    const handleConfirmChanges = async () => {
      const groupNameInput: HTMLInputElement =
        this.#parent.querySelector("#group-name")!;
      const name: GroupUpdateRequest = { chatName: groupNameInput.value };

      const groupName = JSON.stringify(name);

      const formData = new FormData();
      formData.append("chat_data", groupName);
      formData.append("avatar", groupAvatarFile);

      const response = await API.putFormData<GroupUpdateResponse>(
        "/chat/" + chat.chatId,
        formData,
      );
      if (!response.error) {
        chat.chatName = groupName;
        if (response.updatedAvatarPath !== "") {
          chat.avatarPath = response.updatedAvatarPath;
        }

        ChatStorage.setChat(chat);

        Router.go("/chat/" + chat.chatId, false);
      }
    };

    updateConfirmButton.addEventListener("click", handleConfirmChanges);
  }
}