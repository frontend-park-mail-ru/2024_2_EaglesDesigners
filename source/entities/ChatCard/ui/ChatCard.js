import ChatCardTemplate from './ChatCard.handlebars'

export class ChatCard{
    #parent;
    constructor(parent){
      this.#parent = parent;
    }
  
    render(chat){
      this.#parent.insertAdjacentHTML('beforeend', ChatCardTemplate({chat}));
 
    }
  }