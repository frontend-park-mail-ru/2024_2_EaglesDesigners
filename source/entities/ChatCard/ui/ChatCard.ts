import { TChat } from '@/entities/Chat/model/type';
import ChatCardTemplate from './ChatCard.handlebars'
import'./ChatCard.scss'

export class ChatCard{
  #parent;
  constructor(parent:Element){
    this.#parent = parent;
  }

  render(chat:TChat){
    this.#parent.insertAdjacentHTML('beforeend', ChatCardTemplate({chat}));
  }
}
