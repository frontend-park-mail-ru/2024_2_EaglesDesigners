export interface TChat{
    avatarURL?: string;
    chatId?: number;
    chatName?: string;
    chatType?: 'personalMessages' | 'group' | 'channel';
    lastMessage?: string;
    usersId?: number[];
}