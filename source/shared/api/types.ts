export interface ChatModel{
    avatarURL?: string;
    chatId?: number;
    chatName?: string;
    chatType?: 'personalMessages' | 'group' | 'channel';
    lastMessage?: string;
    usersId?: number[];
}
export type ChatListModel = ChatModel[];