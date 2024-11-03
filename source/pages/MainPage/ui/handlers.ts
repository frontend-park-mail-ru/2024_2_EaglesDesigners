import { TChatMessage } from "@/entities/ChatMessage";
import { UserStorage } from "@/entities/User";

export const renderMessage = (message:TChatMessage) =>{
    if(message.chatId !== UserStorage.getChat().chatId){
        return;
    } 

    if(message.authorID === UserStorage.getUser().id){ // TODO: добавить иконку отправки сообщения и при успешном response, убирать ее
        return;
    }

    UserStorage.getChatMessageEntity().renderNewMessage(message);
}