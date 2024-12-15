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
import { ChatMessagesResponse } from "@/shared/api/types";
import { messageHandler } from "../api/MessageHandler";
import { formatBytes } from "@/shared/helpers/formatBytes";


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

  async renderMessages(messages: TChatMessage[]) {
    const placeholder= this.#parent.querySelector('#msg-placeholder');
    if(placeholder) {
      placeholder.remove();
    }

    if (
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

      if (!this.#newestMessage) {
        this.#newestMessage = messageWithFlags;
      }

      const user = ChatStorage.getUsers().find(user => user.id === message.authorID)!;
      let avatarURL = "";
      if(message.authorID !== "00000000-0000-0000-0000-000000000000") {
        avatarURL = user.avatarURL
        ? serverHost + user.avatarURL
        : "/assets/image/default-avatar.svg";
      }
      
      const photos = message.photos ? message.photos.map(photoURL => ({
        url: `${serverHost}${photoURL.url}`
      })) : [];

      console.log('files', message);
      const extentionRegex = /\.([^.]+)$/;
      const nameRegex = /^(.+)\.[^.]+$/;

      const files = message.files ? await Promise.all(message.files.map(async (file: string) => {

        return {
          name: nameRegex.exec(file.filename)![1],
          extention: extentionRegex.exec(file.filename)![1].toUpperCase(),
          size: formatBytes(file.size)
        };
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
            files: files
          },
        }),
      );
      
      const currentMessageId = this.#parent.lastElementChild!.id;
      messageHandler(currentMessageId, messages);
    }
  }
  async renderNewMessage(message: TChatMessage) {
    const placeholder= this.#parent.querySelector('#msg-placeholder');
    if(placeholder) {
      placeholder.remove();
    }

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

      const photos = message.photos ? message.photos.map(photoURL => ({
        url: `${serverHost}${photoURL.url}`
      })) : [];

      console.log('files', message);
      const extentionRegex = /\.([^.]+)$/;
      const nameRegex = /^(.+)\.[^.]+$/;

      const files = message.files ? await Promise.all(message.files.map(async (file: string) => {

        return {
          name: nameRegex.exec(file.filename)![1],
          extention: extentionRegex.exec(file.filename)![1].toUpperCase(),
          size: formatBytes(file.size)
        };
      })) : [];
    
      this.#parent.insertAdjacentHTML(
        "afterbegin",
        ChatMessageTemplate({
          message: {
            ...messageWithFlags,
            datetime: getTimeString(messageWithFlags.datetime),
            avatarURL: avatarURL,
            authorName: user?.name,
            photos: photos,
            files: files
          },
        }),
      );

      const newMessageElement = document.getElementById(message.messageId)!;
      const handleMessageClick = (event : MouseEvent) => {
        const messageId = newMessageElement.id;
        const message = document.getElementById(messageId)!;
        if (message) {
          const menu = message.querySelector("#menu-context")!;
          const messageText = message.querySelector(".message__body__text")?.textContent;
          const messageMenu = new MessageMenu(menu);
          if (messageText) {
            messageMenu.render(messageId, messageText, event.x, event.y);
          }
        }
      };

      
      newMessageElement.addEventListener("contextmenu", handleMessageClick);
    }
  }
}

