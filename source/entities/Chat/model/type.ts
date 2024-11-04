import { TChatMessage } from "@/entities/ChatMessage";

export interface TChat {
  avatarURL: string;
  chatId: string;
  chatName: string;
  chatType: "personalMessages" | "group" | "channel";
  lastMessage: TChatMessage;
  usersId: number[];
}
