export interface TChat {
  avatarURL: string;
  chatId: string;
  chatName: string;
  chatType: "personal" | "group" | "channel";
  lastMessage: string;
  usersId: number[];
}
