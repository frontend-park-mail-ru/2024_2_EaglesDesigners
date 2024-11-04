import { API } from "@/shared/api/api";
import { TUser } from "../index";
import { AuthResponse } from "@/shared/api/types";
import { TChat } from "@/entities/Chat";
import { ChatMessage } from "@/entities/ChatMessage";
import { wsConn } from "@/shared/api/ws";

class UserStore {
  #user: TUser;
  #chat: TChat;
  #chatMessageEntity: ChatMessage;

  constructor() {
    this.#user = { id: "", name: "", username: "" };
    this.#chat = {
      avatarPath: "",
      chatId: "",
      chatName: "",
      chatType: "personal",
      lastMessage: "",
      usersId: []
    };
    this.#chatMessageEntity = new ChatMessage(null);
  }

  async init() {
    const response = await API.get<AuthResponse>("/auth");
    if (!response.error) {
      this.#user = response.user;
      wsConn.start();
    }
  }

  setUser(user: TUser) {
    this.#user = user;
  }

  getUser() {
    return this.#user;
  }


  setUserName(name: string) {
    this.#user.name = name;
  }    
  setChat(chat: TChat) {
    this.#chat = chat;
  }

  getChat() {
    return this.#chat;
  }

  setChatMessageEntity(chatMessage: ChatMessage) {
    this.#chatMessageEntity = chatMessage;
  }

  getChatMessageEntity() {
    return this.#chatMessageEntity;
  }
}

export const UserStorage = new UserStore();
