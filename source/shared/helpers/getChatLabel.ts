import { ChatLabel } from "@/app/config";
import { ChatType } from "@/entities/Chat/model/type";

export const getChatLabel = (chatType: ChatType) => {
  return ChatLabel[chatType] || chatType;
};
