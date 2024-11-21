import { API } from "@/shared/api/api.ts";
import { ChatsResponse, searchChatsResponse } from "@/shared/api/types";
import { TChat } from "@/entities/Chat";
import { ChatCard } from "@/entities/ChatCard";
import ChatListTemplate from "./ChatList.handlebars";
import "./ChatList.scss";
import { Chat } from "@/widgets/Chat/ui/Chat";
import { ContactsList } from "@/widgets/ContactsList";
import { AddGroupForm } from "@/widgets/AddGroupForm";
import { AddChannelForm } from "@/widgets/AddChannelForm/ui/AddChannelForm";
import { debounce } from "@/shared/helpers/debounce";

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

    const chatList : HTMLElement = this.#parent.querySelector("#chat-list")!;
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

    const createChannelBtn = addChat.querySelector("#create-channel")!;

    const handelCreateChannel = () => {
      const addChannelForm = new AddChannelForm(this.#parent, this.#chat);
      addChannelForm.render();
    };
    createChannelBtn.addEventListener('click', handelCreateChannel);

    const searchInput : HTMLInputElement = this.#parent.querySelector("#search-input")!;

    const handleSearchChats = async () => {
      const searchChatsList : HTMLElement = this.#parent.querySelector('#search-chats-list')!;
      const searchUserChats : HTMLElement = searchChatsList.querySelector("#search-user-chats")!;
      const searchGlobalChats : HTMLElement = searchChatsList.querySelector("#search-globals-chats")!;
      searchUserChats.innerHTML = '';
      searchGlobalChats.innerHTML = '';
      
      const chatName = searchInput.value;
      if (chatName !== "") {

        const labelGlobalContacts : HTMLInputElement = searchChatsList.querySelector("#label-global-chats")!;
        const labelUserContacts : HTMLInputElement = searchChatsList.querySelector("#label-user-chats")!;

        const response = await API.get<searchChatsResponse>("/chat/search" + "?key_word="+ chatName);
        console.log(response);
        if (!response.error) {
          chatList.style.display = "none";
          searchChatsList.style.display = "block";
          if (response.user_chats) {
            searchUserChats.innerHTML = '';
            labelUserContacts.style.display = "block";
            const userChats = new ChatCard(searchUserChats, this.#chat);
            response.user_chats.forEach((element) => {
              userChats.render(element);
            });
          }
          else {
            labelUserContacts.style.display = "none";
          }
          if (response.global_channels) {
            searchGlobalChats.innerHTML = '';
            labelGlobalContacts.style.display = "block";
            const globalChats = new ChatCard(searchGlobalChats, this.#chat);
            response.global_channels.forEach((element) => {
              globalChats.render(element);
            });
          }
          else{
            labelGlobalContacts.style.display = "none";
          }
        }
      }
      else {
        searchChatsList.style.display = "none";
        chatList.style.display = "block";
      }
      return;
    };
    const debouncedHandle = debounce(handleSearchChats, 250);

    searchInput.addEventListener("input", debouncedHandle);
  }
}
