import { API } from "@/shared/api/api";
import ChatTemplate from "./Chat.handlebars";
import "./Chat.scss";
import {
  ChatResponse,
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
    this.#chatInfo.innerHTML = "";
    ChatStorage.setChat(chat);
    const avatar = chat.avatarPath
        ? serverHost + chat.avatarPath
        : "/assets/image/default-avatar.svg";

    this.#parent.innerHTML = ChatTemplate({
      chat: {
        ...chat,
        chatType: getChatLabel(chat.chatType),
      },
      avatar,
    });

    const messagesImport = this.#parent.querySelector("#chat__messages")!;
    const chatMessage = new ChatMessage(messagesImport);
    ChatStorage.setChatMessageInstance(chatMessage);

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
          chatId: ChatStorage.getChat().chatId,
          branchId: "",
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
      .querySelector("#chat__input-send-btn")!
      .addEventListener("click", sendInputMessage);

    const response = await API.get<ChatResponse>(
      "/chat/" + chat.chatId,
    );
    ChatStorage.setRole(response.role ?? "");
    ChatStorage.setUsers(response.users ?? []);

    const messages: TChatMessage[] = response.messages ?? [];
    if (messages.length > 0) {
      chatMessage.renderMessages(messages);
    }

    const chatHeader = this.#parent.querySelector("#header-chat")!;

    const handleChatHeader = () => {
      if (this.#chatInfo.innerHTML !== "") {
        this.#chatInfo.innerHTML = "";
      } else if (chat.chatType === "personal") {
        const chatInfo = new ChatInfo(this.#chatInfo, chat);
        chatInfo.render();
      } else if (chat.chatType === "group") {
        const chatInfo = new GroupChatInfo(this.#chatInfo, chat);
        chatInfo.render();
      }
    };
    chatHeader.addEventListener("click", handleChatHeader);

    document.querySelector<HTMLElement>('#widget-import')!.style.left = '-100vw'; 
    document.querySelector<HTMLElement>('#chat-info-container')!.style.right = '-100vw'; 
  }
}
