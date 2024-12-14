import { TChat } from "@/entities/Chat/model/type";
import ChatCardTemplate from "./ChatCard.handlebars";
import "./ChatCard.scss";
import { Chat } from "@/widgets/Chat";
import { serverHost } from "@/app/config";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { getTimeString } from "@/shared/helpers/getTimeString";

export class ChatCard {
  #parent;
  #chat;

  constructor(parent: Element, chat: Chat) {
    this.#parent = parent;
    this.#chat = chat;
    console.log(chat, "chatCard")
  }

  render(chat: TChat) {
    let avatar;
    if (chat.avatarPath !== "") {
      avatar = serverHost + chat.avatarPath;
    } else {
      avatar = "/assets/image/default-avatar.svg";
    }

    this.#parent.insertAdjacentHTML(
      "beforeend",
      ChatCardTemplate({
        chat: {
          ...chat,
          lastMessage: {
            ...chat.lastMessage,
            datetime: getTimeString(chat.lastMessage.datetime),
          },
        },
        avatar,
      }),
    );
    this.#parent.lastElementChild!.addEventListener("click", (e) => {
      e.preventDefault();
      
      if (ChatStorage.getChat() !== chat) {
        const newUrl = `/chat/${chat.chatId}`;
        history.pushState({ url: newUrl }, "", newUrl);
        
        if (ChatStorage.getChat().chatId) {
          const currentChat = document.querySelector(`[id='${ChatStorage.getChat().chatId}']`)!;
          if (currentChat) {
            currentChat.classList.remove('active');
          }
          
        }
        const chatCard : HTMLElement = document.querySelector(`[id='${chat.chatId}']`)!;
        if (chatCard) {
          chatCard.classList.add('active');
        }
        console.log(chat);
        console.log(this.#chat)
        this.#chat.render(chat);
      }
    });

    const chatCard = this.#parent.lastElementChild!;

    chatCard.addEventListener("mouseover", () => {
      chatCard.classList.add('hover');
    });
    chatCard.addEventListener("mouseout", () => {
      chatCard.classList.remove('hover');
    });
  }
}
