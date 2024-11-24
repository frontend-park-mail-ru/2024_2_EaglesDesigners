import { API } from "@/shared/api/api";
import ChatTemplate from "./Chat.handlebars";
import "./Chat.scss";
import {
  ChatResponse,
  EmptyResponse,
  ProfileResponse,
  ResponseChat,
  searchMessagesResponse,
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
import { debounce } from "@/shared/helpers/debounce";
import { SearchedMessageCard } from "@/entities/SearchedMessageCard/ui/SearchedMessageCard";

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
    const chatCard : HTMLElement = document.querySelector("[id='" + chat.chatId + "']")!;
    if (chatCard) {
      chatCard.classList.add('active');
    }

    const messagesImport : HTMLElement = this.#parent.querySelector("#chat__messages")!;
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

      if (messageText) {
        
        if (textArea.classList.contains('edit')) {
          const messageId = textArea.classList[2]!;
          const response = await API.put(
            "/messages/" + messageId,
            {
              text: messageText,
            },
          );
          if (!response.error) {
            textArea.classList.remove('edit');
            textArea.classList.remove(messageId);
            const message = document.getElementById(messageId)!;
            const messageBody = message.querySelector(".message__body__text")!;
            messageBody.textContent = messageText;
          
          }
          
          return;
        }

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

    const responseChat = await API.get<ChatResponse>(
      "/chat/" + chat.chatId,
    );
    ChatStorage.setRole(responseChat.role ?? "");
    ChatStorage.setUsers(responseChat.users ?? []);

    const messages: TChatMessage[] = responseChat.messages ?? [];
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

    const searchMessagesButton : HTMLElement = this.#parent.querySelector("#search-messages")!;
    const messagesSearch : HTMLElement = this.#parent.querySelector("#message-search-input")!;
    const searchInput : HTMLInputElement = messagesSearch.querySelector("#input-search")!;
    const chatInfoHeader : HTMLElement = this.#parent.querySelector("#chat-info")!;
    const searchImageContainer : HTMLElement = this.#parent.querySelector("#search-image-container")!;


    const handleSearchMessages = async (event : Event) => {
      event.stopPropagation();
      messagesSearch.style.display = "flex";
      chatInfoHeader.style.display = "none";
      searchImageContainer.style.display = "none";
      const messagesSearchResult : HTMLElement = this.#parent.querySelector('#search-results-messages')!;

      const messageText = searchInput.value;
      if (messageText !== "") {
        const response = await API.get<searchMessagesResponse>("/chat/" + chat.chatId + "/messages/search?search_query=" + messageText);
        if (!response.error) {
          if (response.messages) {
            const searchMessages = new SearchedMessageCard(messagesSearchResult);
            response.messages.forEach(async (element) => {
              const profileUser = ChatStorage.getUsers();
              const index = profileUser.findIndex((elem) => {
                return element.authorID === elem.id;
              });
              if (index !== -1) {
                searchMessages.render(element, profileUser[index].avatarURL, profileUser[index].name, messagesImport, chatMessage);
              }
              else {
                API.get<ProfileResponse>("/profile/" + element.authorID)
                  .then((res) => {
                    searchMessages.render(element, res.avatarURL, res.name, messagesImport, chatMessage);
                  });
              }
            });
          }
        }
      }
      else {
        messagesSearchResult.innerHTML = '';
      }
    };
    searchMessagesButton.addEventListener('click', handleSearchMessages);

    const debouncedHandler = debounce(handleSearchMessages, 250);
    searchInput.addEventListener("input", debouncedHandler);
    searchInput.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    const cancelSearchButton = this.#parent.querySelector("#cancel-search")!;
    const handleCancelSearch = (event : Event) => {
      event.stopPropagation();
      messagesSearch.style.display = "none";
      chatInfoHeader.style.display = "flex";
      searchImageContainer.style.display = "flex";
    };
    cancelSearchButton.addEventListener('click', handleCancelSearch);
  }
}
