import { ChatList } from "@/widgets/ChatList";
import { Chat } from "@/widgets/Chat";
import { API } from "@/shared/api/api.ts";
import { ChatsResponse } from "@/shared/api/types";
import MainPageTemplate from "./MainPage.handlebars";
import "./MainPage.scss";
import { View } from "@/app/View";
import { TUser, UserStorage } from "@/entities/User";
import { ProfileForm } from "@/widgets/ProfileForm";
import { ContactsList } from "@/widgets/ContactsList";
import { wsConn } from "@/shared/api/ws";
import { TChat } from "@/entities/Chat";
import { renderMessage } from "./handlers";
import { serverHost } from "@/app/config";

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
  async render(chatid: string | null = null) {
    const user: TUser = UserStorage.getUser();

    const parent = document.getElementById("root")!;
    let avatar: string;
    if (user.avatarURL) {
      avatar = serverHost + user.avatarURL;
    } else {
      avatar = "/assets/image/default-avatar.svg";
    }

    document.body.id = 'main';
    parent.innerHTML = MainPageTemplate({ user, avatar });

    const chatUserInfo = parent.querySelector("#chat-info-container")!;
    const chatListParent = parent.querySelector("#widget-import")!;

    const chatParent = parent.querySelector("#chat-content")!;
    const chat = new Chat(chatParent, chatUserInfo);

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

    const settingsButton = parent.querySelector("#settings-button")!;
    const handleSettings = () => {
      const profileForm = new ProfileForm(chatListParent, chat);
      profileForm.render();
    };
    settingsButton.addEventListener("click", handleSettings);

    const userAvatar = parent.querySelector("#user-avatar")!;
    userAvatar.addEventListener("click", handleSettings);

    const contactButton = parent.querySelector("#contact-button");

    const handleContacts = () => {
      const contactForm = new ContactsList(chatListParent, chat);
      contactForm.render();
    };
    contactButton?.addEventListener("click", handleContacts);

    const homeButton = parent.querySelector("#home-button")!;

    const handleHome = () => {
      chatList.render();
    };

    homeButton.addEventListener("click", handleHome);

    const iframe = document.getElementsByTagName('iframe');
    console.log(iframe);
    iframe[0].onload = function() {
      const iframeWindow = iframe[0].contentDocument!;
      console.log(iframeWindow)
      const rootDocument = iframeWindow.getElementById("root")!;
      const cancelSurveyButton = rootDocument.getElementsByClassName("survey-header-cancel__img")!;
      const cancelBtn = cancelSurveyButton;
      console.log(cancelBtn)
    };


    

    wsConn.subscribe("newMessage", renderMessage);
  }
}
