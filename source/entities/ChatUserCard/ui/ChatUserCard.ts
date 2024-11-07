import { ProfileResponse } from "@/shared/api/types";
import ChatUserCardTemplate from "./ChatUserCard.handlebars";
import "./ChatUserCard.scss";
import { serverHost } from "@/app/config";

export class ChatUserCard {
  #parent;
  constructor(parent: Element) {
    this.#parent = parent;
  }

  render(userProfile: ProfileResponse) {
    if (userProfile.avatarURL) {
      userProfile.avatarURL = serverHost + userProfile.avatarURL;
    } else {
      userProfile.avatarURL = "/assets/image/default-avatar.svg";
    }
    
    this.#parent.insertAdjacentHTML(
      "beforeend",
      ChatUserCardTemplate({ userProfile }),
    );

    this.#parent.lastElementChild!.style.pointerEvents = 'none';
  }
}
