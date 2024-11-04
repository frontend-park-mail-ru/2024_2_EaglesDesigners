import { ChatList } from "@/widgets/ChatList";
import { Chat } from "@/widgets/Chat";
import { API } from "@/shared/api/api.ts";
import { ChatsResponse, EmptyRequest, EmptyResponse } from "@/shared/api/types";
import MainPageTemplate from "./MainPage.handlebars";
import "./MainPage.scss";
import { View } from "@/app/View";
import { Router } from "@/shared/Router/Router";
import { TUser, UserStorage } from "@/entities/User";
import { ProfileForm } from "@/widgets/ProfileForm";
import { ContactsList } from "@/widgets/ContactsList";
import { wsConn } from "@/shared/api/ws";
import { TChat } from "@/entities/Chat";
import { renderMessage } from "./handlers";

/**
 * Mainpage class provides functions for rendering main page
 */
export class MainPage extends View {
  constructor() {
    super();
  }
  /**
   * Render MainPage
   * @function render
   * @async
   */
  async render(chatid = null) {
    const user: TUser = UserStorage.getUser();

    const parent = document.getElementById("root")!;
    parent.innerHTML = MainPageTemplate({ user });

    const chatListParent = parent.querySelector("#widget-import")!;

    const chatParent = parent.querySelector("#chat-content-block")!;
    const chat = new Chat(chatParent);

    //const chatListParent = parent.querySelector("#chat-list-import")!;

    const chatList = new ChatList(chatListParent, chat);
    chatList.render();

    if (chatid) {
      let chats: TChat[] = [];
      const response = await API.get<ChatsResponse>("/chats");
      if (response.chats) {
        chats = response.chats;
        const index = chats.findIndex((elem) => chatid === elem.chatId);

        if (index !== -1) {
          chat.render(chats[index]);
        } else {
          history.pushState({ url: "/" }, "", "/");
        }
      }
    }

    const exitButton = parent.querySelector(".exit-btn")!;

    const handleExitClick = async () => {
      const response = await API.post<EmptyResponse, EmptyRequest>(
        "/logout",
        {},
      );

      if (!response.error) {
        UserStorage.setUser({ id: "", name: "", username: "" });
        wsConn.close();
        Router.go("/login");
      }
    };

    exitButton.addEventListener("click", handleExitClick);

    const settingsButton = parent.querySelector("#settings-button")!;
    const handleSettings = () => {
      const profileForm = new ProfileForm(chatListParent);
      profileForm.render();
    };
    settingsButton.addEventListener("click", handleSettings);

    const contactButton = parent.querySelector("#contact-button");

    const handleContacts = () => {
      const contactForm = new ContactsList(chatListParent);
      contactForm.render();
    };
    contactButton?.addEventListener("click", handleContacts);

    const homeButton = parent.querySelector("#home-button")!;

    const handleHome = () => {
      chatList.render();
    };

    homeButton.addEventListener("click", handleHome);

    wsConn.subscribe(renderMessage);
  }
}
