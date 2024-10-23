import { View } from "@/app/View";
import ProfilePageTemplate from './ProfilePage.handlebars';
import "./ProfilePage.scss";
import { API } from "@/shared/api/api";

export class ProfilePage extends View{
    
    constructor(){
        super();
    }


    async render() {
        const root = document.getElementById('root')!;
        root.innerHTML = ProfilePageTemplate();

        const response = await API.get('/profile');
        console.log(response);
    }
}
