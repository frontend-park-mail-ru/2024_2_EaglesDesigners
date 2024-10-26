import ProfileFormTemplate from "./ProfileForm.handlebars";
import "./ProfileForm.scss";
import { API } from "@/shared/api/api";
import { Router } from "@/shared/Router/Router.ts";
import { validateNickname } from "@/shared/validation/nicknameValidation";
import { validateForm } from "@/shared/validation/formValidation";
import {
  ProfileResponse,
} from "@/shared/api/types";
import { UserStorage } from "@/entities/User";
import * as moment from "moment";

export class ProfileForm{
  #parent;
  constructor(parent : Element) {
    this.#parent = parent;
  }

  async render() {
    const user = UserStorage.getUser();
    const response = await API.get<ProfileResponse>("/profile");

    this.#parent.innerHTML = ProfileFormTemplate({ user, response });
    console.log(typeof response.birthdate);
    const birthday = moment(response.birthdate).utc().format("YYYY-MM-DD");
    const birthdayInput: HTMLInputElement = this.#parent.querySelector("#date")!;
    birthdayInput.value = birthday;

    const avatar : HTMLImageElement = this.#parent.querySelector('#avatar')!;
    avatar.src = 'data:image/png;base64,' + response.avatarBase64;
    console.log(avatar.src);

    const avatarInput : HTMLInputElement = this.#parent.querySelector('#ava')!;
    let avatar64 : string | ArrayBuffer | undefined;
    const handleAvatar = () => {
        if (avatarInput.files) {
            const file = avatarInput.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    let base64String;
                    if (e.target) {
                      base64String = e.target.result;
                    }
                    let index : number = 0;
                    if (typeof base64String === 'string') {
                      index = base64String?.indexOf('base64,');
                    }
                    avatar64 = base64String?.slice(index + 'base64,'.length);
                    avatar.src = 'data:image/png;base64,' + avatar64;
                };
                
                reader.readAsDataURL(file); // Читаем файл как data URL (base64)
            }

        }
    };
    avatarInput.addEventListener('change', handleAvatar);
    
    

    const backButton = this.#parent.querySelector("#back-button");
    const handleBack = () => {
      Router.go("/");
    };
    backButton?.addEventListener("click", handleBack);



    const confirmButton = this.#parent.querySelector("#confirm-button");
    const updateProfileInfo = () => {
      const nameInput: HTMLInputElement = this.#parent.querySelector("#user-name")!;
      const bioInput : HTMLInputElement = this.#parent.querySelector('#bio')!;
      const nickname: string = nameInput.value;
      const birthdayValue = birthdayInput.value;
      console.log(nickname);
      console.log(birthdayValue);
      console.log(avatar64);
      console.log(bioInput.value); 


      const nicknameSpan: HTMLSpanElement = this.#parent.querySelector("#nickname")!;
      if (validateNickname(nickname) && nickname.length > 20) {
        console.log(nameInput.value);
      } else {
        validateForm(nameInput, "Не валидное имя", nicknameSpan);
        return;
      }
      // const response = await API.post<EmptyResponse, SignUpRequest>("/profile", {
      //   name,
      //   username,
      //   password,
      // });

    };
    confirmButton?.addEventListener("click", updateProfileInfo);

  }
}
