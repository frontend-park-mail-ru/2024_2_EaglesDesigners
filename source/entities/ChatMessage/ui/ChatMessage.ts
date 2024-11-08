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

    for (const [index, message] of messages.entries()) {
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

      this.#parent.insertAdjacentHTML(
        "beforeend",
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
  async renderNewMessage(message: TChatMessage) {
    if (
      this.#newestMessage?.last &&
      this.#newestMessage.authorID === message.authorID
    ) {
      this.#parent.firstElementChild!.classList.remove("last-message");
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
