
import { API } from '@/shared/api/api';
import ChatTemplate from './Chat.handlebars';
import "./Chat.scss"
import { ChatMessagesResponse, EmptyResponse, SendMessageRequest } from '@/shared/api/types';
import { ChatMessage, TChatMessage } from '@/entities/ChatMessage';
import { UserStorage } from '@/entities/User';
import { TChat } from '@/entities/Chat';

export class Chat {
    #parent;

    constructor(parent: Element) {
      this.#parent = parent;
    }
    /**
     * Render ChatList widget
     * @function render
     * @async
     */
    async render(chat: TChat) {  
      UserStorage.setChat(chat);

      this.#parent.innerHTML = ChatTemplate({chat});

      const textArea = this.#parent.querySelector('textarea')!;

      textArea.addEventListener('input', function () {
        this.style.height = "";
        this.style.height = (this.scrollHeight) + "px";
      });

      const KeyPressHandler = async (event:KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); 

            const messageText = textArea.value.trim();
            textArea.value = '';

            if (messageText) {

                const user = UserStorage.getUser();

                const currentdate = new Date();
                const datetime = currentdate.getHours() + ":" + currentdate.getMinutes();

                const message: TChatMessage = {
                  authorID: user.id,
                  authorName: user.name,
                  chatId: UserStorage.getChat().chatId,
                  datetime: datetime,
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
    };

      textArea.addEventListener('keypress', KeyPressHandler)

      let messages: TChatMessage[] = [];
      const response = await API.get<ChatMessagesResponse>("/chat/"+ chat.chatId +"/messages");
      if (response.messages) {
        messages = response.messages;
      }

      const messagesImport = this.#parent.querySelector(".messages")!;
      const chatMessage = new ChatMessage(messagesImport);
      UserStorage.setChatMessageEntity(chatMessage);

      chatMessage.renderMessages(messages);
    }
  }