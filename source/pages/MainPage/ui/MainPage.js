import { ChatList } from "../../../widgets/ChatList/ui/ChatList.js";

export class MainPage{
    #parent
    constructor(parent){
        this.#parent = parent;
    }

    render(){

    const template = Handlebars.templates.MainPage;
    this.#parent.innerHTML = template({});

    const chatListParent = this.#parent.querySelector('#chat-list-import');

 
    const chatList = new ChatList(chatListParent);
    chatList.render();
}

}