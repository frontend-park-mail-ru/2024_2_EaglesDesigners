import { TChatMessage } from "@/entities/ChatMessage";

export type ChatType = "personal" | "group" | "channel";

export interface TChat {
  avatarURL: string;
  chatId: string;
  chatName: string;
  chatType: ChatType;
  lastMessage: TChatMessage;
  usersId: string[];
}

export interface TNewChat {
  chatName: string;
  chatType: ChatType;
  usersToAdd: string[];
}
