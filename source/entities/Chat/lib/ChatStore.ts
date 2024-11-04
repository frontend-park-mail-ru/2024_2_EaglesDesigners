import { TChat } from "../model/type";
import { ChatMessage } from "@/entities/ChatMessage";

class ChatStore {
  #chat: TChat;
  #chatMessageInstance: ChatMessage;

  constructor() {
    this.#chat = {
      avatarURL: "",
      chatId: "",
      chatName: "",
      chatType: "personalMessages",
      lastMessage: "",
      usersId: [],
    };
    this.#chatMessageInstance = new ChatMessage(null);
  }

  setChat(chat: TChat) {
    this.#chat = chat;
  }

  getChat() {
    return this.#chat;
  }

  setChatMessageInstance(chatMessage: ChatMessage) {
    this.#chatMessageInstance = chatMessage;
  }

  getChatMessageInstance() {
    return this.#chatMessageInstance;
  }
}

export const ChatStorage = new ChatStore();
