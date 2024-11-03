import ProfileFormTemplate from "./ProfileForm.handlebars";
import "./ProfileForm.scss";
import { API } from "@/shared/api/api";
import { Router } from "@/shared/Router/Router.ts";
import { validateNickname } from "@/shared/validation/nicknameValidation";
import { validateForm } from "@/shared/validation/formValidation";
import { ProfileResponse } from "@/shared/api/types";
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

    this.#parent.innerHTML = ProfileFormTemplate({ user, response });
    const birthday = moment(response.birthdate).utc().format("YYYY-MM-DD");
    const birthdayInput: HTMLInputElement =
      this.#parent.querySelector("#date")!;
    birthdayInput.value = birthday;

    const avatarUser: HTMLImageElement = this.#parent.querySelector("#avatar")!;

    const avatarInput: HTMLInputElement = this.#parent.querySelector("#ava")!;
    let avatar: File;
    const handleAvatar = () => {
      if (avatarInput.files) {
        const file = avatarInput.files[0];
        if (file) {
          avatarUser.src = URL.createObjectURL(file);
          avatar = file;
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

      const birthdate = new Date(birthdayValue);
      const bio = bioInput.value;
      const name = nickname;

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
      const getYear = new Date(dateInput.value).getFullYear();

      const spanDateError: HTMLSpanElement =
        this.#parent.querySelector("#date-error")!;
      if (!validateYear(getYear)) {
        validateForm(
          dateInput,
          "Год рождения должен быть от 1920 до 2020",
          spanDateError,
        );
        flag = false;
      } else {
        spanDateError.textContent = "";
      }

      if (!flag) {
        return;
      }

      const response = await API.putProfile("/profile", {
        bio,
        birthdate,
        name,
        avatar,
      });

      if (!response.error) {
        UserStorage.setUserName(name);
      }

      Router.go("/");
    };
    confirmButton?.addEventListener("click", updateProfileInfo);
  }
}
