import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { TMessageWS } from "@/shared/api/types";

export const renderMessage = async (message: TMessageWS) => {
  console.log(message)
  if (message.chatId !== ChatStorage.getChat().chatId && message.parent_chat_id !== ChatStorage.getChat().chatId) {
    return;
  }
  
  console.log("render")
  ChatStorage.getChatMessageInstance()?.renderNewMessage(message);
};
