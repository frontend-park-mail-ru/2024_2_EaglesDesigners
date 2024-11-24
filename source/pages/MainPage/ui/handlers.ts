import { ChatStorage } from "@/entities/Chat/lib/ChatStore";
import { TMessageWS } from "@/shared/api/types";

export const renderMessage = async (message: TMessageWS) => {
  if (message.chatId !== ChatStorage.getChat().chatId) {
    return;
  }

  // if (message.authorID === UserStorage.getUser().id) {
  //   // TODO: добавить иконку отправки сообщения и при успешном response, убирать ее
  //   return;
  // }

  ChatStorage.getChatMessageInstance()?.renderNewMessage(message);
};
