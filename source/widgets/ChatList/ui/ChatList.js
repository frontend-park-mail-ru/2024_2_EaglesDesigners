import { API } from "../../../shared/api/api.js";
import ChatListTemplate from './ChatList.handlebars';
import { ChatCard } from "../../../entities/ChatCard/index.js";
import './ChatList.css'

/**
 * ChatList class provides functions for rendering list of user's chats
 */
export class ChatList {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }
  /**
   * Render ChatList widget
   * @function render
   * @async
   */
  async render() {
    // let chats = [
    // ];
    let chats = [
      { chatId : "prop1", chatName : "lmao", avatarURL:"https://i.pinimg.com/originals/fa/9c/13/fa9c13a52830c584fa8b96dab8652023.jpg", lastMessage: "Купи мне деньга" },
      { chatId : "prop2", chatName : "Егор Крид", avatarURL:"https://chpic.su/_data/stickers/a/Avatars_Emoji/Avatars_Emoji_003.webp",lastMessage: "Мама мама мама круго голова" },
      { chatId : "prop3", chatName : "Коллектор", avatarURL:"https://chpic.su/_data/stickers/a/Avatars_Emoji/Avatars_Emoji_003.webp",lastMessage: "мы тебе дверь снесем слышиш выходи пока можешь" }
  ];
    const response = await API.get("/chats");
    if (response.chats) {
      chats = response.chats;
    }

    this.#parent.innerHTML = ChatListTemplate({});

    const chatList = this.#parent.querySelector("#chat-list");
    const chatCard = new ChatCard(chatList);

    chats.map(chat => {
      chatCard.render(chat);
    });
    
  }
}
