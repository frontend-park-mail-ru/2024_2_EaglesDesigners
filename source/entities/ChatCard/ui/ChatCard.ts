import ChatCardTemplate from "./ChatCard.handlebars";
import "./ChatCard.scss";

export class ChatCard {
  #parent;
  constructor(parent) {
    this.#parent = parent;
  }

  render(chat) {
    this.#parent.insertAdjacentHTML("beforeend", ChatCardTemplate({ chat }));
    
    const chatCardElement = document.querySelector(".chat-card");
    const handleChatCard = (e) => {
      e.preventDefault();
    }
    chatCardElement.addEventListener("click", handleChatCard);
  }
}
