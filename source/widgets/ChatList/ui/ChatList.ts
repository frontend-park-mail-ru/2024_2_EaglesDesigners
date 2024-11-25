import { API } from "@/shared/api/api.ts";
import { ChatsResponse } from "@/shared/api/types";
import { TChat } from "@/entities/Chat";
import { ChatCard } from "@/entities/ChatCard";
import ChatListTemplate from "./ChatList.handlebars";
import "./ChatList.scss";
import { Chat } from "@/widgets/Chat/ui/Chat";
import { ContactsList } from "@/widgets/ContactsList";
import { AddGroupForm } from "@/widgets/AddGroupForm";

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

    const addChat = document.querySelector("#add-chat")!;
    const addChatIcon = addChat.querySelector<HTMLElement>(".add-icon")!;
    const addChatPopup = addChat.querySelector<HTMLElement>("#addChatPopUp")!;


    let degrees = 0;
    addChatIcon.addEventListener("click", (event) => {
      event.stopPropagation();
      addChatPopup.style.display = addChatPopup.style.display === "none" ? "flex" : "none";
      degrees += 45;
      addChatIcon.style.transform = 'rotate(' + degrees + 'deg)';
    });

    document.addEventListener("click", () => {
      if (addChatPopup.style.display !== "none") {
        addChatPopup.style.display = "none";
        degrees += 45;
        addChatIcon.style.transform = 'rotate(' + degrees + 'deg)';
      }
    });

    addChat
      .querySelector("#create-personal-chat")!
      .addEventListener("click", () => {
        const contactForm = new ContactsList(this.#parent, this.#chat);
        contactForm.render();
      });

    addChat
      .querySelector("#create-group-chat")!
      .addEventListener("click", () => {
        const addGroupForm = new AddGroupForm(this.#parent, this.#chat);
        addGroupForm.render();
      });

    document.querySelector<HTMLElement>('#chat-info-container')!.style.right = '-100vw'; 
    this.#parent.style.left = '0';
  }
}
