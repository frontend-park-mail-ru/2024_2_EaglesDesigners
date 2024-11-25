import { UserStorage } from "@/entities/User";
import { MessageMenu } from "@/widgets/MessageMenu/ui/MessageMenu";
import { TChatMessage } from "../model/type";

export const messageHandler = (messageId : string, messages : TChatMessage[]) => {
    const handleMessageClick = (event : MouseEvent) => {
        const pickedMessage = messages.find((elem) => {
          return elem.messageId === messageId;
        });
        console.log(pickedMessage, UserStorage.getUser().id)
        if (pickedMessage?.authorID !== UserStorage.getUser().id) {
          return;
        }
        const message = document.getElementById(messageId)!;
        if (message) {
          const menu = document.querySelector("#menu-context")!;
          console.log(pickedMessage.text, messageId)
          const messageMenu = new MessageMenu(menu);
          if (pickedMessage.text) {
            messageMenu.render(messageId, pickedMessage.text, event.x, event.y);
          }
        }
      };
    document.getElementById(messageId)!.addEventListener("contextmenu", handleMessageClick);
};

