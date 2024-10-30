export interface TChat {
  avatarURL: string;
  chatId: string;
  chatName: string;
  chatType: "personalMessages" | "group" | "channel";
  lastMessage: string;
  usersId: number[];
}
