import { ChatMessage, TChatMessage } from "@/entities/ChatMessage";
import SearchedMessageCardTempalte from "./SearchedMessageCard.handlebars";
import "./SearchedMessageCard.scss";
import { serverHost } from "@/app/config";
import { getTimeString } from "@/shared/helpers/getTimeString";
import { ChatMessagesResponse } from "@/shared/api/types";
import { API } from "@/shared/api/api";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";

export class SearchedMessageCard{
    #parent;
    constructor(parent : HTMLElement){
        this.#parent = parent;
    }

    render(message : TChatMessage, avatar : string, person : string, chatMessages : HTMLElement, Message : ChatMessage) {
        message.datetime = getTimeString(message.datetime);

        avatar = avatar ? serverHost + avatar : "/assets/image/default-avatar.svg";
        const messageResult = SearchedMessageCardTempalte({message, avatar, person});
        this.#parent.insertAdjacentHTML("beforeend", messageResult);
        const currentMessage = this.#parent.lastElementChild!;
        this.#parent.lastElementChild?.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();
            const messageId = currentMessage.id;
            let message : HTMLElement = chatMessages.querySelector(`[id='${messageId}']`)!;
            if (message) {
                message.scrollIntoView({ block: "center", behavior: "smooth" });
            }
            else {
                while (!chatMessages.querySelector(`[id='${messageId}']`)!){
                    const response = await API.get<ChatMessagesResponse>(`/chat/${ChatStorage.getChat().chatId}/messages/pages/${chatMessages.lastElementChild?.id}`)!;
                    if (!response.error) {
                        Message.renderMessages(response.messages);
                    }
                    else {
                        return;
                    }
                }
                message = chatMessages.querySelector(`[id='${messageId}']`)!;
                message.scrollIntoView({ block: "center", behavior: "smooth" });
            }

            const chatInfoHeader : HTMLElement = document.querySelector("#chat-info")!;
            const searchImageContainer : HTMLElement = document.querySelector("#search-image-container")!;
            const messagesSearch : HTMLElement = document.querySelector("#message-search-input")!;
            chatInfoHeader.classList.remove("hidden");
            searchImageContainer.classList.remove("hidden");
            messagesSearch.classList.add('hidden');
            this.#parent.innerHTML = "";
        });
    }
}