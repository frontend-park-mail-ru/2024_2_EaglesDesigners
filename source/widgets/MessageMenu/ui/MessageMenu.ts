import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import MessageMenuTemplate from "./MessageMenu.handlebars";
import "./MessageMenu.scss";
import { DeleteMessage } from "@/feature/DeleteMessage";
import { ChatMessage, TChatMessage } from "@/entities/ChatMessage";
import { API } from "@/shared/api/api";
import { ChatMessagesResponse, createBranchResponse, EmptyRequest } from "@/shared/api/types";
import { event } from "jquery";

export class MessageMenu {
    #parent;
    constructor(parent : Element) {
        this.#parent = parent;
    }

    render(message : TChatMessage, messageId : string, messageText : string, x : number, y : number, chatMessageObject : ChatMessage, branch : boolean = false) {
      console.log(message)  
      const notBranch = !branch;
        this.#parent.innerHTML = MessageMenuTemplate({x, y, notBranch});
        const deleteButton = this.#parent.querySelector("#delete-message")!;

        const handleDelete = async () => {
            const deleteMessageMenu = new DeleteMessage(this.#parent);
            deleteMessageMenu.render(messageId);
        };

        deleteButton.addEventListener("click", handleDelete);

        const editButton = this.#parent.querySelector("#edit-message")!;
        let textArea : HTMLTextAreaElement;
        console.log(branch)
        if (branch === false) {
          textArea = document.querySelector("#textarea")!;
        }
        else {
          textArea = document.querySelector('#branch-textarea')!;
        }
        
        
        const handleEdit = () => {
          console.log(textArea)
            textArea.classList.remove(textArea.classList[1]);
            textArea.classList.remove(textArea.classList[1]);
            textArea.classList.add("edit");
            textArea.classList.add(messageId);
            textArea.value = messageText.trim();
            this.#parent.innerHTML = '';
        };
        editButton.addEventListener("click", handleEdit);
        
        const handlerClickOutsideModal = (e: Event) => {
            if (e.target instanceof Element) {
              if (e.target.className === "modal") {
                this.#parent.innerHTML = "";
              }
            }
          };
      
          document.addEventListener("click", handlerClickOutsideModal);

    
        const branchMessage = document.querySelector("#branch-message")!;
        
        const handleOpenBranch = async (event : MouseEvent) => {
          event.stopPropagation();
          this.#parent.innerHTML = '';
            const startBranch = document.getElementById('start-branch')!;
            const branchInput = document.getElementById("branch-input")!;
            if (message?.branchId) {
                ChatStorage.setCurrentBranchId(message.branchId);
                startBranch?.classList?.add("hidden");
                branchInput?.classList?.remove("hidden");
            }
            else {
                startBranch?.classList?.remove("hidden");
                branchInput?.classList?.add("hidden");
            }
            const currentChat = document.getElementById('chat')!;
            const branchChat = document.getElementById("chat-branch")!;
            currentChat?.classList.add("hidden");
            branchChat?.classList.remove("hidden");
            const chatBranch = document.getElementById("chat-branch")!;
            const chatBranchMessages : HTMLElement = chatBranch.querySelector("#chat__messages")!;
            chatBranchMessages.innerText = '';

            const handleStartBranch = async () => {
                const response = await API.post<createBranchResponse, EmptyRequest>(`/chat/${message.chatId}/${message.messageId}/branch`, {});
                console.log(response);
                if (!response.error) {
                    ChatStorage.setCurrentBranchId(response.id);
                    startBranch?.classList.add("hidden");
                    branchInput?.classList.remove("hidden");
                    const chatBranch = document.querySelector("#chat-branch")!;
                    message.branchId = response.id;
                    chatMessageObject.setParent(chatBranch.querySelector("#chat__messages")!);
                    
                }
                return;
            };

            
            if (message?.branchId) {
                
                ChatStorage.setCurrentBranchId(message.branchId);
                const branchMessages = await API.get<ChatMessagesResponse>(`/chat/${message.branchId}/messages`);
                
                if (!branchMessages.error) {
                  chatMessageObject.setParent(chatBranchMessages);
                  chatMessageObject.renderMessages(branchMessages.messages, false);
                }
            }
            if (startBranch) {
                startBranch.addEventListener('click', handleStartBranch);
            }
        };
        if (branchMessage) {
          branchMessage.addEventListener("click", handleOpenBranch);
        }
        
    }
}