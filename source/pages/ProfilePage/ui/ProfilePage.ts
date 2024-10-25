import { View } from "@/app/View";
import ProfilePageTemplate from './ProfilePage.handlebars';
import "./ProfilePage.scss";
import { API } from "@/shared/api/api";
import { Router } from "@/shared/Router/Router.ts";
import { validateNickname } from "@/shared/validation/nicknameValidation";
import { validateForm } from "@/shared/validation/formValidation";
import { EmptyRequest, EmptyResponse, ProfileResponse } from "@/shared/api/types";
import { UserStorage } from "@/entities/User";
import * as moment from "moment";


export class ProfilePage extends View{
    
    constructor(){
        super();
    }


    async render() {
        const root = document.getElementById('root')!;
        const user = UserStorage.getUser();
        const response = await API.get<ProfileResponse>('/profile');
        console.log(response);
        root.innerHTML = ProfilePageTemplate({user, response});
        const birthday = moment(response.birthdate).utc().format('YYYY-MM-DD');
        const birthdayInput : HTMLInputElement = root.querySelector("#date")!;
        birthdayInput.value = birthday;
        

        const backButton = root.querySelector('#back-button');
        const handleBack = () => {
            Router.go('/');
        };
        backButton?.addEventListener('click', handleBack);

        const confirmButton = root.querySelector('#confirm-button');
        const updateProfileInfo = () => {
            const nameInput : HTMLInputElement = root.querySelector('#user-name')!;
            const nickname : string = nameInput.value;
            const nicknameSpan : HTMLSpanElement = root.querySelector('#nickname')!;
            if (validateNickname(nickname) && nickname.length > 20) {
                console.log(nameInput.value);
            } else {
                validateForm(nameInput, 'Не валидное имя', nicknameSpan);
            }
        };
        confirmButton?.addEventListener('click', updateProfileInfo);

        const logoutButton = root.querySelector("#logout");
        const handleLogout = async () => {
            const response = await API.post<EmptyResponse, EmptyRequest>(
                "/logout",
                {},
              );
        
              if (!response.error) {
                UserStorage.setUser({ id: 0, name: "", username: "" });
                Router.go("/login");
              }
        };
        logoutButton?.addEventListener("click", handleLogout);
    }
}
