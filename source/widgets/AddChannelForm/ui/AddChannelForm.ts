import { Chat } from "@/widgets/Chat";
import AddChannelFormTemplate from "./AddChannelForm.handlebars";
import { ChatList } from "@/widgets/ChatList";
import { validateForm } from "@/shared/validation/formValidation";
import { UserStorage } from "@/entities/User";
import { ChatResponse, NewChatRequest } from "@/shared/api/types";
import { API } from "@/shared/api/api";
import { validateNickname } from "@/shared/validation/nicknameValidation";
import "./AddChannelForm.scss";

export class AddChannelForm{
    #parent;
    #chat;
    constructor(parent : HTMLElement, chat : Chat){
        this.#parent = parent;
        this.#chat = chat;
    }

    render() {
        this.#parent.innerHTML = AddChannelFormTemplate();

        const backButton = this.#parent.querySelector('#back-button')!;

        const handleBack = () => {
            const chatList = new ChatList(this.#parent, this.#chat);
            chatList.render();
        };
        backButton.addEventListener('click', handleBack);

        const avatarRender: HTMLImageElement =
      this.#parent.querySelector("#avatar")!;
        avatarRender.src = "/assets/image/default-avatar.svg";
        const avatarInput: HTMLInputElement = this.#parent.querySelector("#ava")!;
        let avatarFile: File;
        const handleAvatar = () => {
        if (avatarInput.files) {
            const file = avatarInput.files[0];
        const maxFileSize = 10 * 1024 * 1024;
        if (file) {
          const avatarSpanError: HTMLSpanElement =
            this.#parent.querySelector("#avatar-error")!;
          if (file.size > maxFileSize) {
            validateForm(
              avatarInput,
              "Размер файла не должен превышать 10МБ",
              avatarSpanError,
            );
            return;
          } else {
            avatarSpanError.innerText = "";
          }
          avatarRender.src = URL.createObjectURL(file);
          avatarFile = file;
        }
        }
        };
        avatarInput.addEventListener("change", handleAvatar);

        const channelNameInput : HTMLInputElement = this.#parent.querySelector("#channel-name")!;

        const createChannelButton = this.#parent.querySelector("#confirm-button")!;

        const handleCreateChannel = async () => {
            const channelName = channelNameInput.value;
            const user : string[] = [UserStorage.getUser().id];
            const newChat: NewChatRequest = {
                chatName: channelName,
                chatType: "channel",
                usersToAdd: user,
              };

              const avatarSpanError: HTMLSpanElement =
              this.#parent.querySelector("#avatar-error")!;
              avatarSpanError.textContent = '';

            const channelNameRender: HTMLSpanElement =
            this.#parent.querySelector("#chanel-error-name")!;
            if (!channelName.length) {
                validateForm(channelNameInput, "Название канала должно содержать хотя бы 1 символ", channelNameRender);
                return;
              }
            if (!validateNickname(newChat.chatName)) {
              validateForm(channelNameInput, "Допустимы только латинские и русские буквы, пробелы, цифры и нижние подчеркивания.", channelNameRender);
              return;
            }
            if (newChat.chatName.length > 20) {
              validateForm(channelNameInput, "Название канала должно быть меньше 20 символов", channelNameRender);
              return;
            }
            channelNameRender.textContent = '';
            const formData: FormData = new FormData();
            const jsonProfileData = JSON.stringify(newChat);
            formData.append("chat_data", jsonProfileData);
            formData.append("avatar", avatarFile);

            const newChatRes = await API.postFormData<ChatResponse>(
                "/addchat",
                formData,
            );

            
            if (!newChatRes.error) {
                this.#chat.render(newChatRes);
                const chatList = new ChatList(this.#parent, this.#chat);
                chatList.render();
            }
            else {
                validateForm(channelNameInput, "Файл не является изображением", channelNameRender);
                return;
            }
            
        };
        createChannelButton.addEventListener('click', handleCreateChannel);
    }
}
