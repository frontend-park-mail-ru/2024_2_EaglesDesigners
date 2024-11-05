import { TChatMessage } from "@/entities/ChatMessage";

export type ChatType = "personal" | "group" | "channel";

export interface TChat {
  avatarPath: string;
  chatId: string;
  chatName: string;
<<<<<<< HEAD
  chatType: "personal" | "group" | "channel";
  lastMessage: string;
=======
  chatType: ChatType;
  lastMessage: TChatMessage;
>>>>>>> main
  usersId: number[];
}
