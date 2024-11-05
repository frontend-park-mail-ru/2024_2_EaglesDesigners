import { TChatMessage } from "@/entities/ChatMessage";

export type ChatType = "personal" | "group" | "channel";

export interface TChat {
  avatarPath: string;
  chatId: string;
  chatName: string;
  chatType: ChatType;
  lastMessage: TChatMessage;
  usersId: number[];
}
