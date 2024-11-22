import {
  TChatMessage,
  TChatMessageWithFlags,
} from "@/entities/ChatMessage/model/type";
import ChatMessageTemplate from "./ChatMessage.handlebars";
import "./ChatMessage.scss";
import { UserStorage } from "@/entities/User";
import { getTimeString } from "@/shared/helpers/getTimeString";
import { serverHost } from "@/app/config";
import { ProfileResponse } from "@/shared/api/types";
import { API } from "@/shared/api/api";
import { MessageMenu } from "@/widgets/MessageMenu/ui/MessageMenu.ts";

export class ChatMessage {
  #parent;
  #oldestMessage: TChatMessageWithFlags | null = null;
  #newestMessage: TChatMessageWithFlags | null = null;

  constructor(parent: Element) {
    this.#parent = parent;
  }

  async renderMessages(messages: TChatMessage[]) {
    if (
      this.#oldestMessage?.first &&
      this.#oldestMessage.authorID === messages[0].authorID
    ) {
      this.#parent.lastElementChild!.classList.remove("first-message");
    }
    const handleMessageClick = (event) => {
      const messageId = event.target.id;
      const message = document.getElementById(messageId)!;
      if (message) {
        const menu = message.querySelector("#menu-context")!;
        const messageText = message.querySelector(".message__body__text")?.textContent;
        console.log(messageText)
        const messageMenu = new MessageMenu(menu);
        if (messageText) {
          messageMenu.render(messageId, messageText, event.x, event.y);
        }
      }
    };
    for (const [index, message] of messages.entries()) {
      console.log(message);
      const isFirst =
        index === messages.length - 1 ||
        message.authorID !== messages[index + 1].authorID;
      const isLast =
        index === 0 || message.authorID !== messages[index - 1].authorID;
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

      const profile = await API.get<ProfileResponse>(
        "/profile/" + message.authorID,
      );
      const avatarURL = profile.avatarURL
        ? serverHost + profile.avatarURL
        : "/assets/image/default-avatar.svg";

      const msg = ChatMessageTemplate({
        message: {
          ...messageWithFlags,
          datetime: getTimeString(messageWithFlags.datetime),
          avatarURL,
        },
      });
      this.#parent.insertAdjacentHTML(
        "beforeend",
        msg,
      );
      this.#parent.lastElementChild!.addEventListener('contextmenu', handleMessageClick); 
      console.log(this.#parent.lastElementChild?.id);
    }

    

  }
  async renderNewMessage(message: TChatMessage) {
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

      const profile = await API.get<ProfileResponse>(
        "/profile/" + message.authorID,
      );
      const avatarURL = profile.avatarURL
        ? serverHost + profile.avatarURL
        : "/assets/image/default-avatar.svg";

      console.log(this.#parent);
      this.#parent.insertAdjacentHTML(
        "afterbegin",
        ChatMessageTemplate({
          message: {
            ...messageWithFlags,
            datetime: getTimeString(messageWithFlags.datetime),
            avatarURL,
          },
        }),
      );
    }
  }
}
