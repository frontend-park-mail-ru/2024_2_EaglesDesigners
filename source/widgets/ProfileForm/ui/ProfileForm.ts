import ProfileFormTemplate from "./ProfileForm.handlebars";
import "./ProfileForm.scss";
import { API } from "@/shared/api/api";
import { validateNickname } from "@/shared/validation/nicknameValidation";
import { validateForm } from "@/shared/validation/formValidation";
import { EmptyRequest, EmptyResponse, ProfileRequest, ProfileResponse } from "@/shared/api/types";
import { UserStorage } from "@/entities/User";
import * as moment from "moment";
import { validateYear } from "@/shared/validation/yearValidation";
import { serverHost } from "@/app/config";
import { genProfileData } from "../api/updateProfile";
import { ChatList } from "@/widgets/ChatList";
import { Chat } from "@/widgets/Chat";
import { Router } from "@/shared/Router/Router";
import { wsConn } from "@/shared/api/ws";

export class ProfileForm {
  #parent;
  #chat;
  constructor(parent: Element, chat: Chat) {
    this.#parent = parent;
    this.#chat = chat;
  }

  async render() {
    const user = UserStorage.getUser();
    const response = await API.get<ProfileResponse>("/profile");
    if (response.avatarURL) {
      response.avatarURL = serverHost + response.avatarURL;
    }
    else if (UserStorage.getUser().avatarURL){
      response.avatarURL = UserStorage.getUser().avatarURL;
    }
    else {
      response.avatarURL = "/assets/image/default-avatar.svg";
    }
    
    const currentDate = new Date();

    this.#parent.innerHTML = ProfileFormTemplate({
      user,
      response,
      currentDate,
    });
    const birthday = moment(response.birthdate).utc().format("YYYY-MM-DD");
    const birthdayInput: HTMLInputElement =
      this.#parent.querySelector("#date")!;
    birthdayInput.value = birthday;

    const avatarUser: HTMLImageElement = this.#parent.querySelector("#avatar")!;

    const avatarInput: HTMLInputElement = this.#parent.querySelector("#ava")!;
    let avatarFile: File;
    const handleAvatar = () => {
      if (avatarInput.files) {
        const file = avatarInput.files[0];
        const maxFileSize = 10*1024*1024;
        if (file) {
          const avatarSpanError : HTMLSpanElement = this.#parent.querySelector('#avatar-error')!;
          if (file.size > maxFileSize) {
            validateForm(avatarInput, "Размер файла не должен превышать 10МБ", avatarSpanError);
            return;
          } else{
            avatarSpanError.innerText = '';
          }
          avatarUser.src = URL.createObjectURL(file);
          avatarFile = file;
        }
      }
    };
    avatarInput.addEventListener("change", handleAvatar);

    const backButton = this.#parent.querySelector("#back-button");
    const handleBack = () => {
      const chatList = new ChatList(this.#parent, this.#chat);
      chatList.render();
    };
    backButton?.addEventListener("click", handleBack);

    const confirmButton = this.#parent.querySelector("#confirm-button");
    const updateProfileInfo = async () => {
      const nameInput: HTMLInputElement =
        this.#parent.querySelector("#user-name")!;
      const bioInput: HTMLInputElement = this.#parent.querySelector("#bio")!;

      const nickname: string = nameInput.value;
      const birthdayValue = birthdayInput.value;

      const profileData: ProfileRequest = {
        bio: bioInput.value,
        birthdate: new Date(birthdayValue),
        name: nickname,
      };

      let flag = true;
      const nicknameSpan: HTMLSpanElement =
        this.#parent.querySelector("#nickname")!;
      if (!validateNickname(profileData.name)) {
        validateForm(nameInput, "Допустимы только латинские и русские буквы, пробелы, цифры и нижние подчеркивания.", nicknameSpan);
        flag = false;
      }
      else if (profileData.name.length > 20) {
        validateForm(nameInput, "Имя не может быть длиннее 20 символов", nicknameSpan);
        flag = false;
      }
      else {
        nicknameSpan.textContent = "";
      }
      const dateInput: HTMLInputElement = this.#parent.querySelector("#date")!;

      const spanDateError: HTMLSpanElement =
        this.#parent.querySelector("#date-error")!;
      if (!validateYear(profileData.birthdate)) {
        validateForm(
          dateInput,
          "Введите реальную дату и год рождения от 1920 до " +
            new Date().getFullYear(),
          spanDateError,
        );
        flag = false;
      } else {
        spanDateError.textContent = "";
      }

      if (!flag) {
        return;
      }

      const errorMessage = await genProfileData(profileData, avatarFile);
      if (errorMessage != "" && errorMessage === "error message") {
        validateForm(nameInput, "Вы не авторизованы", nicknameSpan);
        return;
      } else if (errorMessage != "") {
        validateForm(
          nameInput,
          "Произошла какая-то ошибка, попробуйте еще раз",
          nicknameSpan,
        );
        return;
      }
      
      if (avatarFile) {
        const userAvatar : HTMLImageElement =  document.querySelector('#user-avatar')!;
        userAvatar.src = URL.createObjectURL(avatarFile);
        UserStorage.setAvatar(userAvatar.src);
      }
      UserStorage.setUserName(nickname);

      handleBack();
    };
    confirmButton?.addEventListener("click", updateProfileInfo);


    const exitButton = this.#parent.querySelector(".exit-btn")!;

    const handleExitClick = async () => {
      const response = await API.post<EmptyResponse, EmptyRequest>(
        "/logout",
        {},
      );

      if (!response.error) {
        UserStorage.setUser({ id: "", name: "", username: "", avatarURL: ""});
        wsConn.close();
        Router.go("/login");
      }
    };

    exitButton.addEventListener("click", handleExitClick);
  }
}
