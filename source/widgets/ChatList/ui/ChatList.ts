import { API } from "@/shared/api/api.ts";
import { ChatsResponse } from "@/shared/api/types";
import { TChat } from "@/entities/Chat";
import { ChatCard } from "@/entities/ChatCard";
import ChatListTemplate from "./ChatList.handlebars";
import "./ChatList.scss";
import { Chat } from "@/widgets/Chat/ui/Chat";

/**
 * ChatList class provides functions for rendering list of user's chats
 */
export class ChatList {
  #parent;
  #chat;

  constructor(parent: Element, chat: Chat) {
    this.#parent = parent;
    this.#chat = chat;
  }
  /**
   * Render ChatList widget
   * @function render
   * @async
   */
  async render() {
    const response = await API.get<ChatsResponse>("/chats");
    const chats: TChat[] = response.chats ?? [];

    this.#parent.innerHTML = ChatListTemplate({});

    const chatList = this.#parent.querySelector("#chat-list")!;
    const chatCard = new ChatCard(chatList, this.#chat);

    chats.forEach((chat) => {
      chatCard.render(chat);
    });

    const addChat = document.querySelector('.add-chat')!;
    const addChatButton = addChat.querySelector('#addChatButton')!;
    const addChatPopup = addChat.querySelector('#addChatPopUp')!;

    addChatButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Остановить всплытие события
        addChatPopup.style.display = addChatPopup.style.display === 'none' ? 'flex' : 'none';
    });

    document.addEventListener('click', () => {
        addChatPopup.style.display = 'none';
    });

    addChat.querySelector('.create-personal-chat')!.addEventListener('click', () => {
        console.log('Создать личный чат');
    });

    addChat.querySelector('.create-group-chat')!.addEventListener('click', () => {
        console.log('Создать группу');
    });
  }
}
