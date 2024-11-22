import { TChat, TChatUser } from "../model/type";
import { ChatMessage } from "@/entities/ChatMessage";

class ChatStore {
  #chat: TChat;
  #role: string;
  #users: TChatUser[];
  #chatMessageInstance: ChatMessage | null;

  constructor() {
    this.#chat = {
      avatarPath: "",
      chatId: "",
      chatName: "",
      chatType: "personal",
      lastMessage: {
        authorID: "",
        chatId: "",
        branchId: "",
        datetime: "",
        isRedacted: false,
        messageId: "",
        text: "",
      },
      countOfUsers: 0,
    };
    this.#role = "";
    this.#users = [];
    this.#chatMessageInstance = null;
  }

  setChat(chat: TChat) {
    this.#chat = chat;
  }

  getChat() {
    return this.#chat;
  }

  setRole(role: string) {
    this.#role = role;
  }

  getRole() {
    return this.#role;
  }

  setUsers(users: TChatUser[]) {
    this.#users = users;
  }

  getUsers() {
    return this.#users;
  }

  setChatMessageInstance(chatMessage: ChatMessage) {
    this.#chatMessageInstance = chatMessage;
  }

  getChatMessageInstance() {
    return this.#chatMessageInstance;
  }
}

export const ChatStorage = new ChatStore();
