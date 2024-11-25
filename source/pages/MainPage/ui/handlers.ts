import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { TMessageWS } from "@/shared/api/types";

export const renderMessage = async (message: TMessageWS) => {
  if (message.chatId !== ChatStorage.getChat().chatId) {
    return;
  }

  ChatStorage.getChatMessageInstance()?.renderNewMessage(message);
};
