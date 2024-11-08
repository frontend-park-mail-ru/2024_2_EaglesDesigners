import { TChat } from "../model/type";
import { ChatMessage } from "@/entities/ChatMessage";

class ChatStore {
  #chat: TChat;
  #chatMessageInstance: ChatMessage | null;

  constructor() {
    this.#chat = {
      avatarPath: "",
      chatId: "",
      chatName: "",
      chatType: "personal",
      lastMessage: {
        authorID: "",
        authorName: "",
        chatId: "",
        datetime: "",
        isRedacted: false,
        messageId: "",
        text: "",
      },
      usersId: [],
    };
    this.#chatMessageInstance = null;
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
