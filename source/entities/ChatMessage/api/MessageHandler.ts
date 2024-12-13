import { UserStorage } from "@/entities/User";
import { MessageMenu } from "@/widgets/MessageMenu/ui/MessageMenu";
import { TChatMessage } from "../model/type";
import { API } from "@/shared/api/api";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { ChatMessagesResponse, createBranchResponse, EmptyRequest } from "@/shared/api/types";
import { ChatMessage } from "../ui/ChatMessage";

export const messageHandler = (messageId : string, messages : TChatMessage[], chatMessageObject : ChatMessage) => {
    const message = document.getElementById(messageId)!;
    const handleMessageClick = (event : MouseEvent) => {
        const pickedMessage = messages.find((elem) => {
          return elem.messageId === messageId;
        });
        if (pickedMessage?.authorID !== UserStorage.getUser().id) {
          return;
        }
        if (message) {
            
          const menu = document.querySelector("#menu-context")!;
          const messageMenu = new MessageMenu(menu);
          if (pickedMessage.text) {
            console.log(menu)
            messageMenu.render(messageId, pickedMessage.text, event.x-100, event.y-25);
          }
        }
      };
    
    if (message) {
        message.addEventListener("contextmenu", handleMessageClick);
    }
    const branch = message.querySelector('#branch')!;
    if (branch) {
        branch.addEventListener("click", async () => {
            const pickedMessage = messages.find((elem) => {
                return elem.messageId === messageId;
              });
            const currentChat = document.getElementById('chat')!;
            const branchChat = document.getElementById("chat-branch")!;
            currentChat.classList.add("hidden");
            branchChat.classList.remove("hidden");

            const handleStartBranch = async () => {
                const response = await API.post<createBranchResponse, EmptyRequest>(`/chat/${messages[0].chatId}/${messageId}/branch`, {});
                console.log(response);
                if (!response.error) {
                    ChatStorage.setCurrentBranchId(response.id);
                    startBranch.classList.add('hidden');
                }
            };
            const startBranch = document.getElementById('start-branch')!;
            if (pickedMessage?.branchId) {
                if (startBranch) {
                    startBranch.classList.add('hidden');
                }
                
                ChatStorage.setCurrentBranchId(pickedMessage.branchId);
                const branchMessages = await API.get<ChatMessagesResponse>(`/chat/${pickedMessage.branchId}/messages`);
                
                if (!branchMessages.error) {
                    console.log(chatMessageObject)
                    const chatBranch = document.getElementById("chat-branch")!;
                    chatMessageObject.setParent(chatBranch.querySelector("#chat__messages")!);
                    console.log(chatMessageObject)
                    chatMessageObject.renderMessages(branchMessages.messages);
                }
            }
            if (startBranch) {
                startBranch.addEventListener('click', handleStartBranch);
            }
            
        });
        
    }
    
};

