import'./ChatCard.css'

export class ChatCard{
    #parent;
    constructor(parent){
      this.#parent = parent;
    }
  
    render(chat){
      const template = require('./ChatCard.handlebars');
      this.#parent.insertAdjacentHTML('beforeend', template({chat}));
 
    }
  }