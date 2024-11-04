import { TChat } from "@/entities/Chat/model/type";
import ChatCardTemplate from "./ChatCard.handlebars";
import "./ChatCard.scss";
import { Chat } from "@/widgets/Chat";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { extractTime } from "@/shared/helpers/extractTime";

export class ChatCard {
  #parent;
  #chat;

  constructor(parent: Element, chat:Chat) {
    this.#parent = parent;
    this.#chat = chat;
  }

  render(chat: TChat) {
    this.#parent.insertAdjacentHTML("beforeend", ChatCardTemplate({ 
      chat: {
        ...chat,
        lastMessage: {
          ...chat.lastMessage,
          datetime: extractTime(chat.lastMessage.datetime)
        }
      }
  }));
    this.#parent.lastElementChild!.addEventListener("click", (e) => {
      e.preventDefault();

      if(ChatStorage.getChat() !== chat){
        const newUrl = `/chat/${chat.chatId}`; 
        history.pushState({ url: newUrl }, "", newUrl);
        this.#chat.render(chat);
      }
    });
  }
}
