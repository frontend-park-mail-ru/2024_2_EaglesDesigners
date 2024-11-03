import { ChatList } from "@/widgets/ChatList";
import { Chat } from "@/widgets/Chat";
import { API } from "@/shared/api/api.ts";
import { EmptyRequest, EmptyResponse } from "@/shared/api/types";
import MainPageTemplate from "./MainPage.handlebars";
import "./MainPage.scss";
import { View } from "@/app/View";
import { Router } from "@/shared/Router/Router";
import { TUser, UserStorage } from "@/entities/User";
import { TChatMessage } from "@/entities/ChatMessage";
import { wsConn } from "@/shared/api/ws";
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
  async render() {
    const user: TUser = UserStorage.getUser();

    const parent = document.getElementById("root")!;

    parent.innerHTML = MainPageTemplate({ user });

    const chatUserInfo = parent.querySelector("#chat-info-container")!;
    const chatParent = parent.querySelector(".main-page__chat-content-div__container-chat-div")!;
    const chat = new Chat(chatParent, chatUserInfo);

    const chatListParent = parent.querySelector("#chat-list-import")!;

    const chatList = new ChatList(chatListParent, chat);
    chatList.render();

    

    const exitButton = parent.querySelector(".exit-btn")!;

    const handleExitClick = async () => {
      const response = await API.post<EmptyResponse, EmptyRequest>(
        "/logout",
        {},
      );

      if (!response.error) {
        UserStorage.setUser({ id: "", name: "", username: "" });
        Router.go("/login");
      }
    };

    exitButton.addEventListener("click", handleExitClick);

    const renderMessage = (message:TChatMessage) =>{
      if(message.chatId !== UserStorage.getChat().chatId){
        return;
      } 

      if(message.authorID === UserStorage.getUser().id){ // TODO: добавить иконку отправки сообщения и при успешном response, убирать ее
        return;
      }

        UserStorage.getChatMessageEntity().renderNewMessage(message);

    }
    wsConn.subscribe(renderMessage);
  }
}
