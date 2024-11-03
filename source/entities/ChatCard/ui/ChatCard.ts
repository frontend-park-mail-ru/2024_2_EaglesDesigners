import { TChat } from "@/entities/Chat/model/type";
import ChatCardTemplate from "./ChatCard.handlebars";
import "./ChatCard.scss";
import { Chat } from "@/widgets/Chat";
import { UserStorage } from "@/entities/User";

export class ChatCard {
  #parent;
  #chat

  constructor(parent: Element, chat:Chat) {
    this.#parent = parent;
    this.#chat = chat;
  }

  render(chat: TChat) {
    this.#parent.insertAdjacentHTML("beforeend", ChatCardTemplate({ chat }));
    this.#parent.lastElementChild!.addEventListener("click", (e) => {
      e.preventDefault();

      if(UserStorage.getChat() !== chat){
        const newUrl = `/chat/${chat.chatId}`; 
        history.pushState({ url: newUrl }, "", newUrl);
        this.#chat.render(chat);
      }
    });
  }
}
