import { TChat } from "@/entities/Chat/model/type";
import ChatCardTemplate from "./ChatCard.handlebars";
import "./ChatCard.scss";
import { Chat } from "@/widgets/Chat";
import { UserStorage } from "@/entities/User";
import { localHost } from "@/app/config";

export class ChatCard {
  #parent;
  #chat

  constructor(parent: Element, chat:Chat) {
    this.#parent = parent;
    this.#chat = chat;
  }

  render(chat: TChat) {
    if (chat.avatarPath !== "") {
      chat.avatarPath = localHost + chat.avatarPath;
    }
    
    this.#parent.insertAdjacentHTML("beforeend", ChatCardTemplate({ chat }));
    this.#parent.lastElementChild!.addEventListener("click", (e) => {
      e.preventDefault();

      if(UserStorage.getChat() !== chat){
        this.#chat.render(chat);
      }
    });
  }
}
