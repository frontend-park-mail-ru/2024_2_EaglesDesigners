import { ChatModel } from '@/shared/api/types';
import ChatCardTemplate from './ChatCard.handlebars'
import'./ChatCard.scss'

export class ChatCard{
    #parent;
    constructor(parent){
      this.#parent = parent;
    }
  
    render(chat:ChatModel){
      this.#parent.insertAdjacentHTML('beforeend', ChatCardTemplate({chat}));
    }
  }