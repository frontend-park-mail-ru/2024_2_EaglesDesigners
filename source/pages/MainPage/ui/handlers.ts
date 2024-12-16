import { TChat } from "@/entities/Chat";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { ChatCard } from "@/entities/ChatCard";
import { UserNotification } from "@/feature/Notification";
import { API } from "@/shared/api/api";
import { ChatResponse, ChatsResponse, NewChatWS, ProfileResponse, TMessageWS } from "@/shared/api/types";
import { Chat } from "@/widgets/Chat";

export const renderMessage = async (message: TMessageWS) => {
  if (message.chatId !== ChatStorage.getChat().chatId && message.parent_chat_id !== ChatStorage.getChat().chatId) {
    const responseProfile = await API.get<ProfileResponse>(`/profile/${message.authorID}`);
    if (!responseProfile.error) {
      const chatUserInfo : HTMLElement = document.querySelector("#chat-info-container")!;

      const chatParent = document.querySelector("#chat-content")!;
      const chat = new Chat(chatParent, chatUserInfo);
      const contentNotification = document.getElementById("notification-content")!;
      contentNotification.innerHTML = "";
      const chatCard = new ChatCard(contentNotification, chat);
      const responseChats = await API.get<ChatsResponse>("/chats");
      if (!responseChats.error) {
        const newChatResponse = responseChats.chats.find((elem) => {
          return elem.chatId === message.chatId;
        });
        if (!message.text) {
          message.text = "file";
        }
        console.log(message)
        console.log(message.text)
        const notificationChat : TChat = {
          chatId: message.chatId,
          lastMessage: message,
          avatarPath: responseProfile.avatarURL,
          chatName: responseProfile.name,
          
        };

        if (newChatResponse && newChatResponse.send_notifications) {
          console.log(message)
          chatCard.render(notificationChat, true, newChatResponse);
          UserNotification.show();
        }
        
      }
      
      
    }

   
    return;
  }
  
  ChatStorage.getChatMessageInstance()?.renderNewMessage(message);
};

export const newChat = async (chatInfo: NewChatWS) => {
  const responseChats = await API.get<ChatsResponse>("/chats");
  const responseChatInfo = await API.get<ChatResponse>(`/chat/${chatInfo.chatId}`);
  if (!responseChatInfo.error) {
    if (responseChatInfo.role === "owner") {
      return;
    }
  }
  if (!responseChats.error) {
    const newChatResponse = responseChats.chats.find((elem) => {
      return elem.chatId === chatInfo.chatId;
    });
    const chatUserInfo : HTMLElement = document.querySelector("#chat-info-container")!;

    const chatParent = document.querySelector("#chat-content")!;
    const chat = new Chat(chatParent, chatUserInfo);
    const contentNotification = document.getElementById("notification-content")!;
    contentNotification.innerHTML = "";
    const chatCard = new ChatCard(contentNotification, chat);
    
    if (newChatResponse && newChatResponse.send_notifications)
    {
      chatCard.render(newChatResponse, true);

      UserNotification.show();
    }
    
  }
  return; 
  
};