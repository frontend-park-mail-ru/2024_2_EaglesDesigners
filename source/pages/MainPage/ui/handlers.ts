import { TChat } from "@/entities/Chat";
import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { ChatCard } from "@/entities/ChatCard";
import { UserNotification } from "@/feature/Notification";
import { API } from "@/shared/api/api";
import { ChatResponse, ChatsResponse, NewChatWS, ProfileResponse, TMessageWS } from "@/shared/api/types";
import { Router } from "@/shared/Router/Router";
import { Chat } from "@/widgets/Chat";

export const renderMessage = async (message: TMessageWS) => {
  console.log("ya tut")
  if (message.chatId !== ChatStorage.getChat().chatId && message.parent_chat_id !== ChatStorage.getChat().chatId) {
    const responseProfile = await API.get<ProfileResponse>(`/profile/${message.authorID}`);
    if (!responseProfile.error) {
      const chatUserInfo : HTMLElement = document.querySelector("#chat-info-container")!;

      const chatParent = document.querySelector("#chat-content")!;
      const chat = new Chat(chatParent, chatUserInfo);
      const contentNotification = document.getElementById("notification-content")!;
      contentNotification.innerHTML = "";
      const chatCard = new ChatCard(contentNotification, chat);
      const notificationChat : TChat = {
        chatId: message.chatId,
        lastMessage: message,
        avatarPath: responseProfile.avatarURL,
        chatName: responseProfile.name,
        
      };
      
      chatCard.render(notificationChat);
      UserNotification.show();
      console.log("ya tut")
    }

   
    return;
  }
  
  ChatStorage.getChatMessageInstance()?.renderNewMessage(message);
};

export const newChat = async (chatInfo: NewChatWS) => {
  const responseChats = await API.get<ChatsResponse>("/chats");
  if (!responseChats.error) {
    const newChatResponse = responseChats.chats.find((elem) => {
      return elem.chatId === chatInfo.chatId;
    });
    console.log(newChatResponse);
    const chatUserInfo : HTMLElement = document.querySelector("#chat-info-container")!;

    const chatParent = document.querySelector("#chat-content")!;
    const chat = new Chat(chatParent, chatUserInfo);
    const contentNotification = document.getElementById("notification-content")!;
    contentNotification.innerHTML = "";
    const chatCard = new ChatCard(contentNotification, chat);
    
    if (newChatResponse) {
      chatCard.render(newChatResponse);
      UserNotification.show();
    }
    
  }
  return; 
  Router.go(`/chat/${chatInfo.chatId}`);
};