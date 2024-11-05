import { TChat } from "@/entities/Chat";
import { TContact } from "@/entities/ContactCard/index.ts";
import { TChatMessage } from "@/entities/ChatMessage";
import { TUser } from "@/entities/User";
import { TNewChat } from "@/entities/Chat/model/type";

export interface ResponseError {
  error: string;
  status: string;
}
export interface EmptyResponse {
  message: string;
}
export interface AuthResponse {
  message: string;
  user: TUser;
}

export interface ContactResponse {
  contactUsername: string;
}

export interface ProfileResponse {
  avatarURL: string;
  bio: string;
  birthdate: Date;
  name: string;
}

export interface ChatResponse{
  message: string;
  chat: TChat;
}

export interface ChatsResponse {
  message: string;
  chats: TChat[];
}
export interface ChatMessagesResponse {
  message: string;
  messages: TChatMessage[];
}

export interface ChatUsersResponse {
  message: string;
  usersId: string[];
}

export type EmptyRequest = {
  [K in string]: never;
};
export interface LoginRequest {
  username: string;
  password: string;
}
export interface SignUpRequest {
  name: string;
  username: string;
  password: string;
}

export interface ProfileRequest {
  name: string;
  birthdate: Date;
  bio: string;
}

export interface ContactRequest {
  contacts: TContact[];
}
export interface ChatRequest {
  chatId: string;
}

export type NewChatRequest = TNewChat;

export interface SendMessageRequest {
  text: string;
}

export interface profileFormRequest {
  avatar: File;
}
