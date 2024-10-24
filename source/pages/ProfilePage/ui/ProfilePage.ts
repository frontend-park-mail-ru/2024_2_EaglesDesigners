import { View } from "@/app/View";
import ProfilePageTemplate from './ProfilePage.handlebars';
import "./ProfilePage.scss";
import { API } from "@/shared/api/api";
import { Router } from "@/shared/Router/Router.ts";
import { validateNickname } from "@/shared/validation/nicknameValidation";
import { validateForm } from "@/shared/validation/formValidation";

export class ProfilePage extends View{
    
    constructor(){
        super();
    }


    async render() {
        const root = document.getElementById('root')!;
        root.innerHTML = ProfilePageTemplate();

        const response = await API.get('/profile');
        console.log(response);

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

    }
}
