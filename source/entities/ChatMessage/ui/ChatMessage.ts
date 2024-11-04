import { TChatMessage, TChatMessageWithFlags } from "@/entities/ChatMessage/model/type";
import ChatMessageTemplate from "./ChatMessage.handlebars";
import "./ChatMessage.scss";
import { UserStorage } from "@/entities/User";
import { extractTime } from "@/shared/helpers/extractTime";

export class ChatMessage {
  #parent;
  #oldestMessage:TChatMessageWithFlags | null = null;
  #newestMessage:TChatMessageWithFlags | null = null;

  constructor(parent: Element) {
    this.#parent = parent;
  }

  renderMessages(messages: TChatMessage[]) {

    if(this.#oldestMessage?.first && this.#oldestMessage.authorID === messages[0].authorID){
      this.#parent.lastElementChild!.classList.remove("first-message");
    }

    messages.map((message, index) => {
      const isFirst = index === messages.length - 1 || message.authorID !== messages[index+1].authorID;
      const isLast = index === 0 || message.authorID !== messages[index-1].authorID;
      const isFromOtherUser = message.authorID !== UserStorage.getUser().id;

      const messageWithFlags: TChatMessageWithFlags = {
          ...message,
          first: isFirst,
          last: isLast,
          isFromOtherUser: isFromOtherUser
      };

      this.#oldestMessage = messageWithFlags;

      if(!this.#newestMessage){
        this.#newestMessage = messageWithFlags;
      }

      this.#parent.insertAdjacentHTML("beforeend", ChatMessageTemplate({
        message: {
          ...messageWithFlags,
          datetime: extractTime(messageWithFlags.datetime)
        }
      }));    
    });
  }
  renderNewMessage(message: TChatMessage) {

    if(this.#newestMessage?.last && this.#newestMessage.authorID === message.authorID){
      this.#parent.firstElementChild!.classList.remove("last-message");
    }

    const isFromOtherUser = message.authorID !== UserStorage.getUser().id;

    const messageWithFlags: TChatMessageWithFlags = {
        ...message,
        first: !this.#newestMessage || this.#newestMessage.authorID !== message.authorID,
        last: true,
        isFromOtherUser: isFromOtherUser
    };

    this.#newestMessage = messageWithFlags;

    this.#parent.insertAdjacentHTML("afterbegin", ChatMessageTemplate({
      message: {
        ...messageWithFlags,
        datetime: extractTime(messageWithFlags.datetime),
      }
    }));
  }
}
