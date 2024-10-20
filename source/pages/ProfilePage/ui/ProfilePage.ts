import { View } from "@/app/View";
import ProfilePageTemplate from './ProfilePage.handlebars';
import "./ProfilePage.scss";

export class ProfilePage extends View{
    
    constructor(){
        super();
    }


    render() {
        const root = document.getElementById('root')!;
        root.innerHTML = ProfilePageTemplate();
    }
}
