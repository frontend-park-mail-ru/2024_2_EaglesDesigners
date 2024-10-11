export class ChatCard{
    #parent;
    constructor(parent){
      this.#parent = parent;
    }
  
    render(chat){
      const template = Handlebars.templates.ChatCard;
      this.#parent.insertAdjacentHTML('beforeend', template({chat}));
 
    }
  }