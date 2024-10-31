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

export class ProfileForm {
  #parent;
  constructor(parent: Element) {
    this.#parent = parent;
  }

  async render() {
    const user = UserStorage.getUser();
    const response = await API.get<ProfileResponse>("/profile");

    this.#parent.innerHTML = ProfileFormTemplate({ user, response });
    const birthday = moment(response.birthdate).utc().format("YYYY-MM-DD");
    const birthdayInput: HTMLInputElement =
      this.#parent.querySelector("#date")!;
    birthdayInput.value = birthday;

    const avatar: HTMLImageElement = this.#parent.querySelector("#avatar")!;
    avatar.src = "data:image/png;base64," + response.avatarBase64;

    const avatarInput: HTMLInputElement = this.#parent.querySelector("#ava")!;
    let avatarBase64: string | ArrayBuffer | undefined;
    const handleAvatar = () => {
      if (avatarInput.files) {
        const file = avatarInput.files[0];
        if (file) {
          const reader = new FileReader();

          reader.onload = function (e) {
            let base64String;
            if (e.target) {
              base64String = e.target.result;
            }
            let index: number = 0;
            if (typeof base64String === "string") {
              index = base64String?.indexOf("base64,");
            }
            avatarBase64 = base64String?.slice(index + "base64,".length);
            avatar.src = "data:image/png;base64," + avatarBase64;
          };

          reader.readAsDataURL(file); // Читаем файл как data URL (base64)
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

      const response = await API.put("/profile", {
        avatarBase64,
        bio,
        birthdate,
        name,
      });

      if (!response.error) {
        UserStorage.setUserName(name);
      }

      Router.go("/");
    };
    confirmButton?.addEventListener("click", updateProfileInfo);
  }
}
