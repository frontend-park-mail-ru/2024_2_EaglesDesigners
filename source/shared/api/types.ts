import { View } from "@/app/View";

export interface ChatModel{
    avatarURL?: string;
    chatId?: number;
    chatName?: string;
    chatType?: 'personalMessages' | 'group' | 'channel';
    lastMessage?: string;
    usersId?: number[];
}
export type ChatListModel = ChatModel[];

export interface Routes{
    path?: string;
    view?: View;
}