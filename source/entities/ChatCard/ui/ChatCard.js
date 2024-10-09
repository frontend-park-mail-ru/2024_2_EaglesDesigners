export class ChatCard{
    #parent;
    constructor(parent){
      this.#parent = parent;
    }
  
    render(chats){
      const template = Handlebars.templates.ChatCard;
      chats.map(chat => {
        console.log(chat);
        this.#parent.innerHTML += template({chat});
      });
      
    }
  }