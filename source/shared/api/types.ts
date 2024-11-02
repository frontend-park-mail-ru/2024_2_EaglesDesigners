import { TChat } from "@/entities/Chat";
import { TContact } from "@/entities/ContactCard/index.ts";
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

export interface ContactResponse {
  contactUsername: string;
}

export interface ProfileResponse {
  avatarURL: string;
  bio: string;
  birthdate: Date;
  name: string;
}

export interface ChatsResponse {
  message: string;
  chats: TChat[];
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
  avatar: File;
}

export interface ContactRequest {
  contacts: TContact[];
}
