import { UserStorage } from "@/entities/User";
import { MessageMenu } from "@/widgets/MessageMenu/ui/MessageMenu";
import { TChatMessage } from "../model/type";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { ChatMessage } from "../ui/ChatMessage";

export const messageHandler = (messageId : string, messages : TChatMessage[], chatMessageObject : ChatMessage) => {
    const message = document.getElementById(messageId)!;
    if(messages.find(messageItem => messageItem.messageId === messageId)?.message_type === "sticker") {
      return;
    }

    const handleMessageClick = (event : MouseEvent) => {
        const pickedMessage = messages.find((elem) => {
          return elem.messageId === messageId;
        });

        if (message) {
          const messageText = message.querySelector("#message-text-content")!.innerHTML; 
          const menu = message.querySelector("#menu-context")!;
          const messageMenu = new MessageMenu(menu);
          if (messageText) {
            if (pickedMessage?.chatId === ChatStorage.getCurrentBranchId()) {
                messageMenu.render(pickedMessage, messageId, messageText, event.x-100, event.y-25, chatMessageObject, true);
                return;
            }

            messageMenu.render(pickedMessage, messageId, messageText, event.x-100, event.y-25, chatMessageObject, false);

           }
        }
      };

    
    if (message) {
        message.addEventListener("contextmenu", handleMessageClick);
    }
    
        
    
    
};

