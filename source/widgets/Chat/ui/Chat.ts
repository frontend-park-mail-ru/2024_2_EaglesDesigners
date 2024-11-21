import { API } from "@/shared/api/api";
import ChatTemplate from "./Chat.handlebars";
import "./Chat.scss";
import {
  ChatMessagesResponse,
  EmptyResponse,
  ResponseChat,
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
import { UserType } from "@/widgets/AddChannelForm/lib/types";

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
    let avatar;
    if (chat.avatarPath != "") {
      avatar = serverHost + chat.avatarPath;
    } else {
      avatar = "/assets/image/default-avatar.svg";
    }

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

    const sendInputMessage = async () => {
      const messageText = textArea.value.trim();
      textArea.value = "";
      console.log("tak")

      if (messageText) {
        
        if (textArea.classList.contains('edit')) {
          console.log("я тут")
          const messageId = textArea.classList[2]!;
          const response = await API.put(
            "/messages/" + messageId,
            {
              text: messageText,
            },
          );
          console.log(response);
          textArea.classList.remove('edit');
          textArea.classList.remove(messageId);
          return;
        }

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
      .querySelector("#chat__input-send-btn")!
      .addEventListener("click", sendInputMessage);

    const response = await API.get<ChatMessagesResponse>(
      "/chat/" + chat.chatId + "/messages",
    );

    const messages: TChatMessage[] = response.messages ?? [];
    if (messages.length > 0) {
      chatMessage.renderMessages(messages);
    }

    const chatHeader = this.#parent.querySelector("#header-chat")!;

    const handleChatHeader = async () => {
      if (this.#chatInfo.innerHTML !== "") {
        this.#chatInfo.innerHTML = "";
      } else if (chat.chatType === "personal") {
        const chatInfo = new ChatInfo(this.#chatInfo, chat);
        chatInfo.render();
      } else if (chat.chatType === "group" || chat.chatType === "channel") {
        const responseChatInfo = await API.get<ResponseChat>("/chat/" + chat.chatId);
        const userType : UserType = {owner: false, admin: false, user: false};
        if (responseChatInfo.role === "owner") {
          userType.owner = true;
        } else if (responseChatInfo.role === "admin") {
          userType.admin = true;
        } else{
          userType.user = true;
        }
        const chatInfo = new GroupChatInfo(this.#chatInfo, chat, userType);
        chatInfo.render();
      }
    };
    chatHeader.addEventListener("click", handleChatHeader);
  }
}
