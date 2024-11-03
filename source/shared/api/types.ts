import { TChat } from "@/entities/Chat";
import { TChatMessage } from "@/entities/ChatMessage";
import { TUser } from "@/entities/User";

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
export interface ChatsResponse {
  message: string;
  chats: TChat[];
}
export interface ChatMessagesResponse {
  message: string;
  messages: TChatMessage[];
}

export interface AddUserResponse {
  message: string;
  error: string;
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
export interface ChatRequest {
  chatId: string;
}
export interface SendMessageRequest {
  text: string;
}

export interface UsersIdRequest {
  usersId : string;
}