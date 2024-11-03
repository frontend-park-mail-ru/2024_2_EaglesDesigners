
import { API } from '@/shared/api/api';
import ChatTemplate from './Chat.handlebars';
import "./Chat.scss"
import { ChatMessagesResponse, EmptyResponse, SendMessageRequest } from '@/shared/api/types';
import { ChatMessage, TChatMessage } from '@/entities/ChatMessage';
import { UserStorage } from '@/entities/User';
import { TChat } from '@/entities/Chat';
import { ChatInfo } from '@/entities/ChatInfo';
import { GroupChatInfo } from '@/entities/GroupChatInfo/ui/GroupChatInfo';

export class Chat {
    #parent;
    #chatInfo;
    constructor(parent: Element, chatInfo : Element) {
      this.#parent = parent;
      this.#chatInfo = chatInfo;
    }
    /**
     * Render ChatList widget
     * @function render
     * @async
     */
    async render(chat: TChat) {  
      UserStorage.setChat(chat);

      this.#parent.innerHTML = ChatTemplate({chat});
      this.#chatInfo.innerHTML = '';

      const textArea = this.#parent.querySelector('textarea')!;

      textArea.addEventListener('input', function () {
        this.style.height = "";
        this.style.height = (this.scrollHeight) + "px";
      });

      const sendInputMessage = () => {
        const messageText = textArea.value.trim();
        textArea.value = '';

        if (messageText) {

            const user = UserStorage.getUser();
            
            const message: TChatMessage = {
              authorID: user.id,
              authorName: user.name,
              chatId: UserStorage.getChat().chatId,
              datetime: new Date().toISOString(),
              isRedacted: false,
              messageId: "",
              text: messageText,
            };

            chatMessage.renderNewMessage(message);  
            
            API.post<EmptyResponse, SendMessageRequest>("/chat/"+chat.chatId+"/messages", {
              text: messageText,
            }); // TODO: добавить иконку отправки сообщения и при успешном await response, убирать ее
        }

        textArea.style.height = "";
      }

      const KeyPressHandler = (event:KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); 
            sendInputMessage();
        }
      };

      textArea.addEventListener('keypress', KeyPressHandler)

      document.querySelector('.input__send-btn')!.addEventListener('click',sendInputMessage);

      let messages: TChatMessage[] = [];
      const response = await API.get<ChatMessagesResponse>("/chat/"+ chat.chatId +"/messages");
      if (response.messages) {
        messages = response.messages;
      }

      const messagesImport = this.#parent.querySelector(".messages")!;
      const chatMessage = new ChatMessage(messagesImport);
      UserStorage.setChatMessageEntity(chatMessage);

      chatMessage.renderMessages(messages);

      const chatHeader = this.#parent.querySelector("#header-chat")!;

      const handleChatHeader = () => {
        console.log(this.#chatInfo.innerHTML)
        if (this.#chatInfo.innerHTML !== ""){
          this.#chatInfo.innerHTML = "";
        }
        else if (chat.chatType === "personal") {
          const chatInfo = new ChatInfo(this.#chatInfo);
          chatInfo.render();
        }
        else if (chat.chatType === "group") {
          const chatInfo = new GroupChatInfo(this.#chatInfo);
          chatInfo.render(); 
        }
        
      };
      chatHeader.addEventListener('click', handleChatHeader);
    }
  }