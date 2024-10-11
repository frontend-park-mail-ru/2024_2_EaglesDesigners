import ChatCardTemplate from './ChatCard.handlebars'
import'./ChatCard.css'

export class ChatCard{
    #parent;
    constructor(parent){
      this.#parent = parent;
    }
  
    render(chat){
      this.#parent.insertAdjacentHTML('beforeend', ChatCardTemplate({chat}));
 
    }
  }