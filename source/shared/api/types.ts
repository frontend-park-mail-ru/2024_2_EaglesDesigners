import { View } from "@/app/View";
import { TChat } from "@/entities/Chat";
import { TUser } from "@/entities/User";

export interface ChatModel{
    avatarURL?: string;
    chatId?: number;
    chatName?: string;
    chatType?: 'personalMessages' | 'group' | 'channel';
    lastMessage?: string;
    usersId?: number[];
}
export type ChatListModel = ChatModel[];

export interface ResponseError{
    error: string;
    status: string;
}
export interface EmptyResponse{
    message: string;
}
export interface AuthResponse{
    message: string;
    user: TUser;
}
export interface ChatsResponse{
    message: string;
    chats: TChat[];
}

export type EmptyRequest = {
    [K in string] : never
}
export interface LoginRequest{
    username: string;
    password: string;
}
export interface SignUpRequest{
    name: string;
    username: string;
    password: string;
}