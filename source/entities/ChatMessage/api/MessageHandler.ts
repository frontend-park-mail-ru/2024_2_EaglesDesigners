import { MessageMenu } from "@/widgets/MessageMenu/ui/MessageMenu";
import { TChatMessage } from "../model/type";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { ChatMessage } from "../ui/ChatMessage";

export const messageHandler = (messageId : string, messages : TChatMessage[], chatMessageObject : ChatMessage) => {
    const message = document.getElementById(messageId)!;
    // if(messages.find(messageItem => messageItem.messageId === messageId)?.message_type === "sticker") {
    //   return;
    // }

    const handleMessageClick = (event : MouseEvent) => {
        const pickedMessage = messages.find((elem) => {
          return elem.messageId === messageId;
        });

        if (message) {
          const messageTxt = message.querySelector("#message-text-content")!;
          const messageText = messageTxt ? message.querySelector("#message-text-content")!.textContent : "";
          const menu = message.querySelector("#menu-context")!;
          const messageMenu = new MessageMenu(menu);
          console.log(message)
          if (messageText) {
            if (pickedMessage?.chatId === ChatStorage.getCurrentBranchId()) {
                messageMenu.render(pickedMessage, messageId, messageText, event.x-100, event.y-25, chatMessageObject, true);
                return;
            }

            messageMenu.render(pickedMessage, messageId, messageText, event.x-100, event.y-25, chatMessageObject, false, true);

          }
          else {
            console.log("я стикер")
          messageMenu.render(pickedMessage, messageId, messageText, event.x-100, event.y-25, chatMessageObject, false, false);
          }
        }
      };

    
    if (message) {
        message.addEventListener("contextmenu", handleMessageClick);
    }
    
        
    
    
};

