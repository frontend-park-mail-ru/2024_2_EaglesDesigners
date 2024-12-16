import { TChat } from "@/entities/Chat";
import { TContact } from "@/entities/ContactCard/index.ts";
import { TChatMessage } from "@/entities/ChatMessage";
import { TUser } from "@/entities/User";
import { TChatUser, TNewChat } from "@/entities/Chat/model/type";
import { TChatMessageAttachment, TStickerPack } from "@/entities/ChatMessage/model/type";

export type TMessageWS = TChatMessage;

export type NewChatWS = NewChat;

export interface NewChat {
  chatId : string;
  users : string[];
}

export interface ResponseChat {
  messages: TChatMessage[];
  role: string;
  users: TUser[];
}

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

export interface ContactRequest {
  contactUsername: string;
}

export interface ProfileResponse {
  avatarURL: string;
  bio: string;
  birthdate: Date;
  name: string;
}

export interface ChatResponse {
  role: string;
  users: TChatUser[];
  messages: TChatMessage[];
  files: TChatMessageAttachment[];
  photos: TChatMessageAttachment[];
}

export interface StickerPacksResponse {
  packs: TStickerPack[];
}
export interface StickersResponse {
  photo: string;
  stickers: string[];
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

export interface ChatUsersResponse {
  message: string;
  usersId: string[];
}

export interface NotificationResponse {
  send_notifications: boolean;
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

export interface ContactResponse {
  contacts: TContact[];
}
export interface ChatRequest {
  chatId: string;
}
export interface SendMessageRequest {
  text: string;
}

export interface UsersIdRequest {
  usersId: string[];
}

export interface UsersIdResponse {
  messages: TChatMessage[];
  users: TUser[];
}

export interface GroupUpdateRequest {
  chatName: string;
}

export interface GroupAvatarData {
  avatar: File;
}

export interface GroupUpdateResponse {
  chatName: string;
  updatedAvatarPath: string;
}

export interface ChatRequest {
  chatId: string;
}
export interface SendMessageRequest {
  text: string;
}

export interface UsersIdRequest {
  usersId: string[];
}

export interface UsersIdResponse {
  usersId: string[];
}

export interface GroupUpdateRequest {
  chatName: string;
}

export interface GroupAvatarData {
  avatar: File;
}

export interface GroupUpdateResponse {
  chatName: string;
  updatedAvatarPath: string;
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

export interface searchContactsResponse {
  global_users: TContact[];
  user_contacts: TContact[];
}

export interface searchChatsResponse {
  global_channels: TChat[];
  user_chats: TChat[];
}

export interface searchMessagesResponse {
  messages: TChatMessage[];
}

export interface createBranchResponse {
  id : string;
}
