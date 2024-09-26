
export class ChatList{
    #parent

    constructor(parent){
        this.#parent = parent;
    }

    render(){
        const chat = [
        { id : "prop1", name : "Борат", lastMessage: "Купи мне деньга" },
        { id : "prop2", name : "Егор Крид", lastMessage: "Мама мама мама круго голова" },
        { id : "prop3", name : "Коллектор", lastMessage: "мы тебе дверь снесем слышиш выходи пока можешь" }
    ];
        const template = Handlebars.templates.ChatList;
        this.#parent.innerHTML = template({chat:chat});   
    }
}