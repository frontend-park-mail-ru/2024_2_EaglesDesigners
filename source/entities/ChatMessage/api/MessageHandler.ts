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
          const messageText = message.querySelector("#message-text-content")!.innerHTML; 
          console.log(messageText) 
          const menu = message.querySelector("#menu-context")!;
          const messageMenu = new MessageMenu(menu);
          if (messageText) {
            console.log(pickedMessage, ChatStorage)
            if (pickedMessage.chatId === ChatStorage.getCurrentBranchId()) {
                messageMenu.render(messageId, messageText, event.x-100, event.y-25, true);
                return;
            }
            messageMenu.render(messageId, messageText, event.x-100, event.y-25, false);
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
            const startBranch = document.getElementById('start-branch')!;
            if (pickedMessage?.branchId) {
                ChatStorage.setCurrentBranchId(pickedMessage.branchId);
            }
            else {
                startBranch.classList.remove("hidden");
            }
            const currentChat = document.getElementById('chat')!;
            const branchChat = document.getElementById("chat-branch")!;
            currentChat.classList.add("hidden");
            branchChat.classList.remove("hidden");
            const chatBranch = document.getElementById("chat-branch")!;
            const chatBranchMessages : HTMLElement = chatBranch.querySelector("#chat__messages")!;
            chatBranchMessages.innerText = '';

            const handleStartBranch = async () => {
                const response = await API.post<createBranchResponse, EmptyRequest>(`/chat/${messages[0].chatId}/${messageId}/branch`, {});
                console.log(response);
                if (!response.error) {
                    ChatStorage.setCurrentBranchId(response.id);
                    startBranch.classList.add('hidden');
                }
            };
            
            if (pickedMessage?.branchId) {
                if (startBranch) {
                    startBranch.classList.add('hidden');
                }
                
                ChatStorage.setCurrentBranchId(pickedMessage.branchId);
                const branchMessages = await API.get<ChatMessagesResponse>(`/chat/${pickedMessage.branchId}/messages`);
                
                if (!branchMessages.error) {
                    chatMessageObject.setParent(chatBranchMessages);
                    chatMessageObject.renderMessages(branchMessages.messages);
                }
            }
            if (startBranch) {
                startBranch.addEventListener('click', handleStartBranch);
            }
            
        });
        
    }
    
};

