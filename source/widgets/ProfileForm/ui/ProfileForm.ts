import ProfileFormTemplate from "./ProfileForm.handlebars";
import "./ProfileForm.scss";
import { API } from "@/shared/api/api";
import { Router } from "@/shared/Router/Router.ts";
import { validateNickname } from "@/shared/validation/nicknameValidation";
import { validateForm } from "@/shared/validation/formValidation";
import { profileFormRequest, ProfileRequest, ProfileResponse } from "@/shared/api/types";
import { UserStorage } from "@/entities/User";
import * as moment from "moment";
import { validateYear } from "@/shared/validation/yearValidation";
import { serverHost } from "@/app/config";

export class ProfileForm {
  #parent;
  constructor(parent: Element) {
    this.#parent = parent;
  }

  async render() {
    const user = UserStorage.getUser();
    const response = await API.get<ProfileResponse>("/profile");
    response.avatarURL = serverHost + response.avatarURL + "?" + Date.now();
    const currentDate = new Date();

    this.#parent.innerHTML = ProfileFormTemplate({ user, response, currentDate });
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
        if (file) {
          avatarUser.src = URL.createObjectURL(file);
          avatarFile = file;
        }
      }
    };
    avatarInput.addEventListener("change", handleAvatar);

    const backButton = this.#parent.querySelector("#back-button");
    const handleBack = () => {
      Router.go("/");
    };
    backButton?.addEventListener("click", handleBack);

    const confirmButton = this.#parent.querySelector("#confirm-button");
    const updateProfileInfo = async () => {
      const nameInput: HTMLInputElement =
        this.#parent.querySelector("#user-name")!;
      const bioInput: HTMLInputElement = this.#parent.querySelector("#bio")!;

      
      const nickname: string = nameInput.value;
      const birthdayValue = birthdayInput.value;

      const profileData : ProfileRequest = {bio: bioInput.value, birthdate: new Date(birthdayValue), name: nickname};


      let flag = true;
      const nicknameSpan: HTMLSpanElement =
        this.#parent.querySelector("#nickname")!;
      if (!validateNickname(nickname) || nickname.length > 20) {
        validateForm(nameInput, "Не валидное имя", nicknameSpan);
        flag = false;
      } else {
        nicknameSpan.textContent = "";
      }
      const dateInput: HTMLInputElement = this.#parent.querySelector("#date")!;

      const spanDateError: HTMLSpanElement =
        this.#parent.querySelector("#date-error")!;
      if (!validateYear(profileData.birthdate)) {
        validateForm(
          dateInput,
          "Введите реальную дату и год рождения от 1920 до " + (new Date()).getFullYear(),
          spanDateError,
        );
        flag = false;
      } else {
        spanDateError.textContent = "";
      }

      if (!flag) {
        return;
      }

      const avatar : profileFormRequest = {avatar: avatarFile};

      const response = await API.putFormData<ProfileResponse, ProfileRequest>("/profile", avatar.avatar, profileData);

      if (!response.error) {
        UserStorage.setUserName(profileData.name);
      }

      Router.go("/");
    };
    confirmButton?.addEventListener("click", updateProfileInfo);
  }
}
