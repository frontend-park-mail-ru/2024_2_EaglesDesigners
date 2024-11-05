import { API } from "@/shared/api/api";
import ChatTemplate from "./Chat.handlebars";
import "./Chat.scss";
import {
  ChatMessagesResponse,
  EmptyResponse,
  SendMessageRequest,
} from "@/shared/api/types";
import { ChatMessage, TChatMessage } from "@/entities/ChatMessage";
import { UserStorage } from "@/entities/User";
import { TChat } from "@/entities/Chat";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { getChatLabel } from "@/shared/helpers/getChatLabel";
import { ChatInfo } from "@/widgets/ChatInfo";
import { GroupChatInfo } from "@/widgets/GroupChatInfo";
import { serverHost } from "@/app/config";

export class Chat {
  #parent;
  #chatInfo;
  constructor(parent: Element, chatInfo: Element) {
    this.#parent = parent;
    this.#chatInfo = chatInfo;
  }
  /**
   * Render ChatList widget
   * @function render
   * @async
   */
  async render(chat: TChat) {
    this.#chatInfo.innerHTML = '';
    ChatStorage.setChat(chat);
    const avatar = serverHost + chat.avatarPath + "?" + Date.now();

    this.#parent.innerHTML = ChatTemplate({
      chat: {
        ...chat,
        chatType: getChatLabel(chat.chatType),
      },
      avatar
    });

    const textArea = this.#parent.querySelector("textarea")!;

    textArea.addEventListener("input", function () {
      this.style.height = "";
      this.style.height = this.scrollHeight + "px";
    });

    const sendInputMessage = () => {
      const messageText = textArea.value.trim();
      textArea.value = "";

      if (messageText) {
        const user = UserStorage.getUser();

        const message: TChatMessage = {
          authorID: user.id,
          authorName: user.name,
          chatId: ChatStorage.getChat().chatId,
          datetime: new Date().toISOString(),
          isRedacted: false,
          messageId: "",
          text: messageText,
        };

        chatMessage.renderNewMessage(message);

        API.post<EmptyResponse, SendMessageRequest>(
          "/chat/" + chat.chatId + "/messages",
          {
            text: messageText,
          },
        );
      }

      textArea.style.height = "";
    };

    const KeyPressHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendInputMessage();
      }
    };

    textArea.addEventListener("keypress", KeyPressHandler);


    
    document
      .querySelector(".input__send-btn")!
      .addEventListener("click", sendInputMessage);

    const response = await API.get<ChatMessagesResponse>(
      "/chat/" + chat.chatId + "/messages",
    );
    const messages: TChatMessage[] = response.messages ?? [];

    const messagesImport = this.#parent.querySelector(".messages")!;
    const chatMessage = new ChatMessage(messagesImport);
    ChatStorage.setChatMessageInstance(chatMessage);

    chatMessage.renderMessages(messages);
    const chatHeader = this.#parent.querySelector("#header-chat")!;

      const handleChatHeader = () => {
        console.log(this.#chatInfo.innerHTML)
        if (this.#chatInfo.innerHTML !== ""){
          this.#chatInfo.innerHTML = "";
        }
        else if (chat.chatType === "personal") {
          const chatInfo = new ChatInfo(this.#chatInfo, chat);
          chatInfo.render();
        }
        else if (chat.chatType === "group") {
          const chatInfo = new GroupChatInfo(this.#chatInfo, chat);
          chatInfo.render(); 
        }
        
      };
      chatHeader.addEventListener('click', handleChatHeader);
  }
}
