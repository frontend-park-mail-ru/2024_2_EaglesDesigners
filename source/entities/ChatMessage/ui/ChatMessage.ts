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
import { formatBytes } from "@/shared/helpers/formatBytes";
import { InfoMessage } from "@/entities/InfoMessage/ui/InfoMessage";

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
    console.log(messages);
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
      if (message.message_type === "default" || message.message_type === "with_payload" || message.message_type === "sticker") {
        

        if (!this.#newestMessage) {
          this.#newestMessage = messageWithFlags;
        }

        const user = ChatStorage.getUsers().find(user => user.id === message.authorID)!;
        const avatarURL = user.avatarURL
          ? serverHost + user.avatarURL
          : "/assets/image/default-avatar.svg";
      
      const photos = message.photos ? message.photos.map(photo => ({
        url: `${serverHost}${photo.url}`
      })) : [];

      const extentionRegex = /\.([^.]+)$/;
      const nameRegex = /^(.+)\.[^.]+$/;

      const files = message.files ? message.files.map(file => ({
        url: `${serverHost}${file.url}`,
        name: nameRegex.exec(file.filename)![1],
        extention: extentionRegex.exec(file.filename)![1].toUpperCase(),
        size: formatBytes(file.size)
      })) : [];

        this.#parent.insertAdjacentHTML(
          "beforeend",
          ChatMessageTemplate({
            message: {
              ...messageWithFlags,
              datetime: getTimeString(messageWithFlags.datetime),
              avatarURL: avatarURL,
              authorName: user?.name,
              photos: photos,
              files: files,
              sticker: message.sticker ? `${serverHost}${message.sticker}` : "",
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
    const placeholder= this.#parent.querySelector('#msg-placeholder');
    if(placeholder) {
      placeholder.remove();
    }
    if (message.text || message.sticker) {
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

      const photos = message.photos ? message.photos.map(photo => ({
        url: `${serverHost}${photo.url}`
      })) : [];

      const extentionRegex = /\.([^.]+)$/;
      const nameRegex = /^(.+)\.[^.]+$/;

      const files = message.files ? message.files.map(file => ({
        url: `${serverHost}${file.url}`,
        name: nameRegex.exec(file.filename)![1],
        extention: extentionRegex.exec(file.filename)![1].toUpperCase(),
        size: formatBytes(file.size)
      })) : [];
    
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
            photos: photos,
            files: files,
            sticker: message.sticker ? `${serverHost}${message.sticker}` : "",
          },
          chatIsNotBranch
        }),
      );

      if (message.isRedacted) {
        const redactedMessage = this.#parent.querySelector("#redacted")!;
        if (redactedMessage) {
          redactedMessage.classList.remove("redacted");
        }
      }

      const newMessageElement = document.getElementById(message.messageId)!;
      const handleMessageClick = (event : MouseEvent) => {
        
        const messageId = newMessageElement.id;
        const messageInChat = document.getElementById(messageId)!;
        if (message) {
          const menu = messageInChat.querySelector("#menu-context")!;
          const messageText = messageInChat.querySelector("#message-text-content")?.textContent;
          const messageMenu = new MessageMenu(menu);
          if (messageText) {
            console.log("hihihi")
            if (ChatStorage.getCurrentBranchId()) {
              messageMenu.render(message, messageId, messageText, event.x-100, event.y-25, this, true);
              return;
            }
            messageMenu.render(message, messageId, messageText, event.x-100, event.y-25, this, false);
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