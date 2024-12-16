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
        console.log(ChatStorage.getCurrentBranchId())
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
                    let response;
                    if (ChatStorage.getCurrentBranchId()) {
                        response = await API.get<ChatMessagesResponse>(`/chat/${ChatStorage.getCurrentBranchId()}/messages/pages/${chatMessages.lastElementChild?.id}`)!;
                    }
                    else {
                        response = await API.get<ChatMessagesResponse>(`/chat/${ChatStorage.getChat().chatId}/messages/pages/${chatMessages.lastElementChild?.id}`)!;
                   
                    }
                    if (!response.error && response.messages.length) {
                        Message.renderMessages(response.messages);
                    }
                    else if (response.error) {
                        return;
                    }

                    if (!response.messages.length) {
                        break;
                    }
                }
                if (!ChatStorage.getCurrentBranchId()) {
                    message = chatMessages.querySelector(`[id='${messageId}']`)!;
                    message.scrollIntoView({ block: "center", behavior: "smooth" });
                    return;
                }
                
                message = document.querySelector("#chat-branch")!.querySelector("#chat__messages")!.querySelector(`[id='${messageId}']`)!;
                console.log(message, messageId)
                message.scrollIntoView({ block: "center", behavior: "smooth" });
            }

            const chatInfoHeader : HTMLElement = document.querySelector("#chat-info")!;
            const searchImageContainer : HTMLElement = document.querySelector("#search-messages")!;
            const messagesSearch : HTMLElement = document.querySelector("#message-search-input")!;
            chatInfoHeader.classList.remove("hidden");
            searchImageContainer.classList.remove("hidden");
            messagesSearch.classList.add('hidden');
            this.#parent.innerHTML = "";
        });
    }
}