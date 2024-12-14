import { API } from "@/shared/api/api";
import ChatTemplate from "./Chat.handlebars";
import "./Chat.scss";
import {
  ChatResponse,
  ProfileResponse,
  searchMessagesResponse,
} from "@/shared/api/types";
import { ChatMessage, TChatMessage } from "@/entities/ChatMessage";
import { TChat } from "@/entities/Chat";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { getChatLabel } from "@/shared/helpers/getChatLabel";
import { ChatInfo } from "@/widgets/ChatInfo";
import { GroupChatInfo } from "@/widgets/GroupChatInfo";
import { serverHost } from "@/app/config";
import { UserType } from "@/widgets/AddChannelForm/lib/types";
import { debounce } from "@/shared/helpers/debounce";
import { SearchedMessageCard } from "@/entities/SearchedMessageCard/ui/SearchedMessageCard";
import { ChatList } from "@/widgets/ChatList";
import { Router } from "@/shared/Router/Router";
import { SendMessage } from "../api/SendMessage";

export class Chat {
  #parent;
  #chatInfo;
  constructor(parent: Element, chatInfo: HTMLElement) {
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
    console.log(this.#parent, chat);
    if (ChatStorage.getChat().chatId) {
      const currentChat = document.querySelector(`[id='${ChatStorage.getChat().chatId}']`)!;
      if (currentChat) {
        currentChat.classList.remove('active');
      }
    }
    const chatCard : HTMLElement = document.querySelector(`[id='${chat.chatId}']`)!;
    if (chatCard) {
      chatCard.classList.add('active');
      
    }
    ChatStorage.setChat(chat);
    const avatar = chat.avatarPath
        ? serverHost + chat.avatarPath
        : "/assets/image/default-avatar.svg";

    const responseInfo = await API.get<ChatResponse>(`/chat/${chat.chatId}`);
    const userType : UserType = {owner: false, user: false, admin: false, not_in_chat: false};
    if (responseInfo.role === "owner") {
      userType.owner = true;
    } else if (responseInfo.role === "admin") {
      userType.admin = true;
    } else if (responseInfo.role === "none") {
      userType.user = true;
    } else{
      userType.not_in_chat = true;
    }
    const chatType = {channel: false, group: false, personal: false};
    if (chat.chatType == "group") {
      chatType.group = true;
    } else if (chat.chatType === "channel"){
      chatType.channel = true;
    } else{
      chatType.personal = true;
    }
    this.#parent.innerHTML = ChatTemplate({
      chat: {
        ...chat,
        chatType: getChatLabel(chat.chatType),
      },
      avatar,
      userType,
      chatType
    });
    const subscribeButton : HTMLElement = this.#parent.querySelector("#subscribe-channel")!;
    const handleSubscribe = async () => {
      const responseSubscribe = await API.post(`/channel/${chat.chatId}/join`, {});
      
      if (!responseSubscribe.error) {
        subscribeButton.classList.add('hidden');
        Router.go(`/chat/${chat.chatId}`, false);
      }
    };
    if (chatType.channel && responseInfo.error) {

      if (subscribeButton) {
        subscribeButton.classList.remove('hidden');
        subscribeButton.addEventListener("click", handleSubscribe);
      }
      
    }

    const messagesImport : HTMLElement = this.#parent.querySelector("#chat__messages")!;
    const chatMessage = new ChatMessage(messagesImport);
    ChatStorage.setChatMessageInstance(chatMessage);

    
    const textArea : HTMLTextAreaElement = this.#parent.querySelector("#textarea")!;
    if (textArea) {
      textArea.addEventListener("input", function () {
        this.style.height = "";
        this.style.height = this.scrollHeight + "px";
      });
    }
    

    const sendInputMessage = async (textArea : HTMLTextAreaElement, branch : boolean) => {
      const messageText = textArea.value.trim();
      textArea.value = "";

      if (messageText) {
        
        if (textArea.classList.contains('edit')) {
          const messageId = textArea.classList[2]!;
          const initialMessageText = document.querySelector(`[id='${messageId}']`)!.querySelector("#message-text-content")!;
          if (messageText === initialMessageText.textContent?.trim()) {
            return;
          }
          const response = await API.put(
            `/messages/${messageId}`,
            {
              text: messageText,
            },
          );
          if (!response.error) {
            textArea.classList.remove('edit');
            textArea.classList.remove(messageId);
            const message = document.getElementById(messageId)!;
            const redactedMessage = message.querySelector("#redacted")!;
            const messageBody = message.querySelector(".message__body__text")!;
            messageBody.textContent = messageText;
            redactedMessage.classList.remove("hidden");
          
          }
          
          return;
        }
        if (!branch) {
          SendMessage(chat.chatId, messageText);
          return;
        }
        SendMessage(ChatStorage.getCurrentBranchId(), messageText);
      }

      textArea.style.height = "";
    };

    const KeyPressHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (event.target instanceof HTMLTextAreaElement) {
          sendInputMessage(event.target, false);
        }
        
      }
    };

    if (textArea) {
      textArea.addEventListener("keypress", KeyPressHandler);
    }
    
    const handleSendChatMessage = () => {
      sendInputMessage(textArea, false);
    };

    if (document.querySelector("#chat__input-send-btn")!) {
        document
        .querySelector("#chat__input-send-btn")!
        .addEventListener("click", handleSendChatMessage);
    }
    

    const responseChat = await API.get<ChatResponse>(
      `/chat/${chat.chatId}`,
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
        const chatInfo = new GroupChatInfo(this.#chatInfo, chat, userType);
        chatInfo.render();
      }
    };
    chatHeader.addEventListener("click", handleChatHeader);

    const searchMessagesButton : HTMLElement = this.#parent.querySelector("#search-messages")!;
    const messagesSearch : HTMLElement = this.#parent.querySelector("#message-search-input")!;
    const searchInput : HTMLInputElement = messagesSearch.querySelector("#input-search")!;
    const chatInfoHeader : HTMLElement = this.#parent.querySelector("#chat-info")!;
    const searchImageContainer : HTMLElement = this.#parent.querySelector("#search-messages")!;


    const handleSearchMessages = async (event : Event) => {
      event.stopPropagation();
      messagesSearch.classList.remove('hidden');
      chatInfoHeader.classList.add('hidden');
      searchImageContainer.classList.add('hidden');
      const messagesSearchResult : HTMLElement = this.#parent.querySelector('#search-results-messages')!;

      const messageText = searchInput.value;
      if (messageText !== "") {
        const response = await API.get<searchMessagesResponse>(`/chat/${chat.chatId}/messages/search?search_query=${messageText}`);
        messagesSearchResult.innerHTML = '';
        if (!response.error) {
          if (response.messages) {
            const searchMessages = new SearchedMessageCard(messagesSearchResult);
            response.messages.forEach(async (element) => {
              const profileUser = ChatStorage.getUsers();
              const profile = profileUser.find((elem) => {
                return element.authorID === elem.id;
              });
              if (profile) {
                searchMessages.render(element, profile.avatarURL, profile.name, messagesImport, chatMessage);
              }
              else {
                API.get<ProfileResponse>(`/profile/${element.authorID}`)
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
      messagesSearch.classList.add("hidden");
      chatInfoHeader.classList.remove("hidden");
      searchImageContainer.classList.remove("hidden");
    };
    cancelSearchButton.addEventListener('click', handleCancelSearch);

    chatHeader.querySelector('#chat-back-button')?.addEventListener('click', (e) => {
      e.stopPropagation();

      history.pushState({ url: "/" }, "", "/");

      const chatListImport : HTMLElement = document.querySelector('#widget-import')!;
      const chatList = new ChatList(chatListImport,this);
      chatList.render();
    });

    document.querySelector<HTMLElement>('#widget-import')!.style.left = '-100vw'; 
    document.querySelector<HTMLElement>('#chat-info-container')!.style.right = '-100vw';
    
    const cancelBranchBtn = this.#parent.querySelector("#cancel-branch")!;

    const chatWidget : HTMLElement = this.#parent.querySelector("#chat")!;
    const branchWidget : HTMLElement = this.#parent.querySelector("#chat-branch")!;
    const handleCancelBranch = () => {
      chatWidget.classList.remove("hidden");
      branchWidget.classList.add("hidden");

      console.log(this.#parent);
      ChatStorage.getChatMessageInstance()?.setParent(chatWidget.querySelector('#chat__messages')!);
      console.log(this.#parent)
      ChatStorage.setCurrentBranchId('');
    };

    cancelBranchBtn.addEventListener("click", handleCancelBranch);


    const branchImageMessageSearch = document.getElementById("branch-search-messages")!;
    const branchChatInfo = document.getElementById("branch-chat-info")!;
    const branchSearchContainer : HTMLInputElement = this.#parent.querySelector("#branch-search-input")!;

    const inputBranchSearch : HTMLInputElement = this.#parent.querySelector("#branch-input-search")!;
    const handleSearchInBranch = async (event : Event) => {
      console.log("это мои запросы")
      event.stopPropagation();
      branchSearchContainer.classList.remove('hidden');
      branchChatInfo.classList.add('hidden');
      branchImageMessageSearch.classList.add('hidden');
      const messagesSearchResult : HTMLElement = this.#parent.querySelector('#branch-search-results-messages')!;
      messagesSearchResult.innerHTML = '';
      

      const messageText = inputBranchSearch.value;
      if (messageText !== "") {
        const response = await API.get<searchMessagesResponse>(`/chat/${ChatStorage.getCurrentBranchId()}/messages/search?search_query=${messageText}`);
        messagesSearchResult.innerHTML = '';
        if (!response.error) {
          if (response.messages) {
            const searchMessages = new SearchedMessageCard(messagesSearchResult);
            response.messages.forEach(async (element) => {
              const profileUser = ChatStorage.getUsers();
              const profile = profileUser.find((elem) => {
                return element.authorID === elem.id;
              });
              if (profile) {
                searchMessages.render(element, profile.avatarURL, profile.name, messagesImport, chatMessage);
              }
              else {
                API.get<ProfileResponse>(`/profile/${element.authorID}`)
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

    const branchSearchMessage = this.#parent.querySelector("#branch-search-messages")!;
    branchSearchMessage.addEventListener("click", handleSearchInBranch);
    const debouncedBranchHandler = debounce(handleSearchInBranch, 250);
    inputBranchSearch.addEventListener("input", debouncedBranchHandler);
    inputBranchSearch.addEventListener('click', (event) => {
      event.stopPropagation();
    });


    const cancelBranchSearch = document.getElementById("branch-cancel-search")!;
    const handleCancelBranchSearch = () => {
      branchSearchContainer.classList.add('hidden');
      branchChatInfo.classList.remove('hidden');
      branchImageMessageSearch.classList.remove('hidden');
    };
    cancelBranchSearch.addEventListener("click", handleCancelBranchSearch);

    const KeyPressBranchHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (event.target instanceof HTMLTextAreaElement) {
          sendInputMessage(event.target, true);
        }
        
      }
    };

    const branchTextArea : HTMLElement = this.#parent.querySelector("#branch-textarea")!;
    if (branchTextArea) {
      branchTextArea.addEventListener("input", function () {
        this.style.height = "";
        this.style.height = this.scrollHeight + "px";
      });
    }
    if (branchTextArea) {
      branchTextArea.addEventListener("keypress", KeyPressBranchHandler);
    }
  }
}
