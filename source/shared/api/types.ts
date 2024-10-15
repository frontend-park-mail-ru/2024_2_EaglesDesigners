import { TUser } from "@/entities/User";

export interface AuthResponse{
    message: string;
    user: TUser;
}
export interface ResponseError{
    error: string;
    status: string;
}

export interface ChatModel{
    avatarURL?: string;
    chatId?: number;
    chatName?: string;
    chatType?: 'personalMessages' | 'group' | 'channel';
    lastMessage?: string;
    usersId?: number[];
}
export type ChatListModel = ChatModel[];