import { TChat, TChatUser } from "../model/type";
import { ChatMessage } from "@/entities/ChatMessage";

class ChatStore {
  #chat: TChat;
  #role: string;
  #users: TChatUser[];
  #chatMessageInstance: ChatMessage | null;
  #currentBranch : string;

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
      send_notification: true,
    };
    this.#role = "";
    this.#users = [];
    this.#chatMessageInstance = null;
    this.#currentBranch = "";
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

  setCurrentBranchId(branchId : string) {
    this.#currentBranch = branchId;
  }

  getCurrentBranchId() {
    return this.#currentBranch;
  }
}

export const ChatStorage = new ChatStore();
