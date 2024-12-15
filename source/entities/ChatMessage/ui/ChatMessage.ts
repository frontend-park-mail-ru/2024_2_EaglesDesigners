import {
  TChatMessage,
  TChatMessageWithFlags,
} from "@/entities/ChatMessage/model/type";
import ChatMessageTemplate from "./ChatMessage.handlebars";
import "./ChatMessage.scss";
import { UserStorage } from "@/entities/User";
import { getTimeString } from "@/shared/helpers/getTimeString";
import { serverHost } from "@/app/config";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { API } from "@/shared/api/api";
import { MessageMenu } from "@/widgets/MessageMenu/ui/MessageMenu.ts";
import { ChatMessagesResponse, createBranchResponse, EmptyRequest } from "@/shared/api/types";
import { messageHandler } from "../api/MessageHandler";
import { InfoMessage } from "@/entities/InfoMessage/";


export class ChatMessage {
  #parent;
  #oldestMessage: TChatMessageWithFlags | null = null;
  #newestMessage: TChatMessageWithFlags | null = null;

  constructor(parent: HTMLElement) {
    this.#parent = parent;

    let nextPageLoading = false;
    this.#parent.addEventListener('scroll', () => {  
      if (this.#parent.offsetHeight - this.#parent.scrollTop >= this.#parent.scrollHeight-1) { 

        if (nextPageLoading) {
          return;
        }
        nextPageLoading = true; 
        
        if(this.#oldestMessage){
          API.get<ChatMessagesResponse>(
            `/chat/${ChatStorage.getChat().chatId}/messages/pages/${this.#oldestMessage?.messageId}`,
          ).then((res) => {
            if(res.messages && res.messages.length > 0){
              this.renderMessages(res.messages);
            }
            nextPageLoading = false;
          }).catch(() => {
            nextPageLoading = false;
          });
        }
      }  
    });
  }

  async renderMessages(messages: TChatMessage[], chatIsNotBranch = true) {
    if ( 
      this.#parent.innerHTML &&
      this.#oldestMessage?.first &&
      this.#oldestMessage.authorID === messages[0].authorID
    ) {
      this.#parent.lastElementChild!.classList.remove("first-message");
    }

    for (const [index, message] of messages.entries()) {
      const isFirst =
          index === messages.length - 1 ||
          message.authorID !== messages[index + 1].authorID;
        const isLast =
          !this.#oldestMessage || this.#oldestMessage.authorID !== message.authorID;
        const isFromOtherUser = message.authorID !== UserStorage.getUser().id;

        const messageWithFlags: TChatMessageWithFlags = {
          ...message,
          first: isFirst,
          last: isLast,
          isFromOtherUser: isFromOtherUser,
        };

        this.#oldestMessage = messageWithFlags;
      if (message.message_type === "default") {
        

        if (!this.#newestMessage) {
          this.#newestMessage = messageWithFlags;
        }

        const user = ChatStorage.getUsers().find(user => user.id === message.authorID)!;
        const avatarURL = user.avatarURL
          ? serverHost + user.avatarURL
          : "/assets/image/default-avatar.svg";
        
        this.#parent.insertAdjacentHTML(
          "beforeend",
          ChatMessageTemplate({
            message: {
              ...messageWithFlags,
              datetime: getTimeString(messageWithFlags.datetime),
              avatarURL: avatarURL,
              authorName: user?.name,
            },
            chatIsNotBranch
          }),
        );
        if (message.isRedacted) {
          const redactedMessage = this.#parent.querySelector(`[id='${message.messageId}']`)!.querySelector("#redacted");
          if (redactedMessage) {
            redactedMessage.classList.remove("hidden");
          }
        }
        
        const currentMessageId = this.#parent.lastElementChild!.id;
        messageHandler(currentMessageId, messages, this);
      }
      if (message.message_type === "informational") {
        const infoMessage = new InfoMessage(this.#parent);
        infoMessage.render(message);
      }
    }
  }
  async renderNewMessage(message: TChatMessage, chatIsNotBranch = true) {
    console.log(ChatStorage)
    if (message.text) {
      if (
        this.#newestMessage?.last &&
        this.#newestMessage.authorID === message.authorID
      ) {
        if (this.#parent.firstElementChild) {
          this.#parent.firstElementChild!.classList.remove("last-message");
        }
      }

      const isFromOtherUser = message.authorID !== UserStorage.getUser().id;

      const messageWithFlags: TChatMessageWithFlags = {
        ...message,
        first:
          !this.#newestMessage ||
          this.#newestMessage.authorID !== message.authorID,
        last: true,
        isFromOtherUser: isFromOtherUser,
      };

      this.#newestMessage = messageWithFlags;

      const user = ChatStorage.getUsers().find(user => user.id === message.authorID)!;
      const avatarURL = user.avatarURL
        ? serverHost + user.avatarURL
        : "/assets/image/default-avatar.svg";

      if (ChatStorage.getCurrentBranchId()) {
        chatIsNotBranch = false;
      }  
      this.#parent.insertAdjacentHTML(
        "afterbegin",
        ChatMessageTemplate({
          message: {
            ...messageWithFlags,
            datetime: getTimeString(messageWithFlags.datetime),
            avatarURL: avatarURL,
            authorName: user?.name,
          },
          chatIsNotBranch
        }),
      );

      const messageInChat : HTMLElement = document.getElementById(message.messageId)!;
      const branch = messageInChat.querySelector('#branch')!;
    if (branch) {
        branch.addEventListener("click", async () => {
            const startBranch = document.getElementById('start-branch')!;
            const branchInput = document.getElementById("branch-input")!;
            if (message?.branchId) {
                ChatStorage.setCurrentBranchId(message.branchId);
                startBranch?.classList?.add("hidden");
                branchInput?.classList?.remove("hidden");
            }
            else {
                startBranch?.classList?.remove("hidden");
                branchInput?.classList?.add("hidden");
            }
            const currentChat = document.getElementById('chat')!;
            const branchChat = document.getElementById("chat-branch")!;
            currentChat?.classList.add("hidden");
            branchChat?.classList.remove("hidden");
            const chatBranch = document.getElementById("chat-branch")!;
            const chatBranchMessages : HTMLElement = chatBranch.querySelector("#chat__messages")!;
            chatBranchMessages.innerText = '';

            const handleStartBranch = async () => {
                const response = await API.post<createBranchResponse, EmptyRequest>(`/chat/${message.chatId}/${message.messageId}/branch`, {});
                console.log(response);
                if (!response.error) {
                    ChatStorage.setCurrentBranchId(response.id);
                    startBranch?.classList.add("hidden");
                    branchInput?.classList.remove("hidden");
                    const chatBranch = document.querySelector("#chat-branch")!;
                    this.setParent(chatBranch.querySelector("#chat__messages")!);
                }
                return;
            };
            
            if (message?.branchId) {
                
                ChatStorage.setCurrentBranchId(message.branchId);
                const branchMessages = await API.get<ChatMessagesResponse>(`/chat/${message.branchId}/messages`);
                
                if (!branchMessages.error) {
                    this.setParent(chatBranchMessages);
                    this.renderMessages(branchMessages.messages, false);
                }
            }
            if (startBranch) {
                startBranch.addEventListener('click', handleStartBranch);
            }
            
        });
    }
      if (message.isRedacted) {
        const redactedMessage = this.#parent.querySelector("#redacted")!;
        if (redactedMessage) {
          redactedMessage.classList.remove("redacted");
        }
      }

      const newMessageElement = document.getElementById(message.messageId)!;
      const handleMessageClick = (event : MouseEvent) => {
        
        const messageId = newMessageElement.id;
        const message = document.getElementById(messageId)!;
        if (message) {
          const menu = message.querySelector("#menu-context")!;
          const messageText = message.querySelector(".message__body__text")?.textContent;
          const messageMenu = new MessageMenu(menu);
          if (messageText) {
            if (ChatStorage.getCurrentBranchId()) {
              messageMenu.render(messageId, messageText, event.x-100, event.y-25, true);
              return;
            }
            messageMenu.render(messageId, messageText, event.x-100, event.y-25, false);
          }
        }
      };

      
      newMessageElement.addEventListener("contextmenu", handleMessageClick);
    }
  }

  getParent() {
    return this.#parent;
  }
  
  setParent(newParent : HTMLElement) {
    this.#parent = newParent;
  }
}