import { TChatMessage } from "@/entities/ChatMessage";

export type ChatType = "personal" | "group" | "channel";

export interface TChat {
  avatarPath: string;
  chatId: string;
  chatName: string;
  chatType: ChatType;
  lastMessage: TChatMessage;
  countOfUsers: number;
  send_notifications: boolean;
}

export interface TNewChat {
  chatName: string;
  chatType: ChatType;
  usersToAdd: string[];
}

export interface TChatUser {
  avatarURL:	string;
  id:	string;
  name:	string;
  role:	string;
  username:	string;
}