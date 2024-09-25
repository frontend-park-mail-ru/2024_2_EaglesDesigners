import { ChatList } from "../../../widgets/ChatList/ui/ChatList.js";

export class MainPage{
    #parent
    constructor(parent){
        this.#parent = parent;
    }

    render(){

    const template = Handlebars.templates.MainPage;
    this.#parent.innerHTML = template({});

    const chatListParent = document.getElementById("chat-list-import");

    const chat = {
        user1 : { id : "prop1", name : "Борат", lastMessage: "Купи мне деньга" },
        user2 : { id : "prop2", name : "Егор Крид", lastMessage: "Мама мама мама круго голова" },
        user3 : { id : "prop3", name : "Коллектор", lastMessage: "мы тебе дверь снесем слышиш выходи пока можешь" }
    };
    const chatList = new ChatList(chatListParent);
    chatList.render(chat);
}

}