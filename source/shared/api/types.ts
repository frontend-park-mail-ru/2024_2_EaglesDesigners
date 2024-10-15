import { TChat } from "@/entities/Chat";
import { TUser } from "@/entities/User";

export interface ResponseError{
    error: string;
    status: string;
}
export interface AuthResponse{
    message: string;
    user: TUser;
}
export interface ChatsResponse{
    message: string;
    chats: TChat[];
}