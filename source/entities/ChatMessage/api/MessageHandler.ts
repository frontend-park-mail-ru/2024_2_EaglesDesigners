import { UserStorage } from "@/entities/User";
import { MessageMenu } from "@/widgets/MessageMenu/ui/MessageMenu";
import { TChatMessage } from "../model/type";

export const messageHandler = (messageId : string, messages : TChatMessage[]) => {
    const handleMessageClick = (event : MouseEvent) => {
        const pickedMessage = messages.find((elem) => {
          return elem.messageId === messageId;
        });
        if (pickedMessage?.authorID !== UserStorage.getUser().id) {
          return;
        }
        const message = document.getElementById(messageId)!;
        if (message) {
          const menu = document.querySelector("#menu-context")!;
          const messageMenu = new MessageMenu(menu);
          if (pickedMessage.text) {
            messageMenu.render(messageId, pickedMessage.text, event.x-100, event.y-25);
          }
        }
      };
    document.getElementById(messageId)!.addEventListener("contextmenu", handleMessageClick);
};

