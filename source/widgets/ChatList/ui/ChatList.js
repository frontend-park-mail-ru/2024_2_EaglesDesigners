
export class ChatList{
    #parent

    constructor(parent){
        this.#parent = parent;
    }

    render(chat){
        const template = Handlebars.templates.ChatList;
        this.#parent.innerHTML = template({chat:chat});
    
    }
}