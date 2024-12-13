export type  MessageType = "informational" | "default";

export interface TChatMessage {
  authorID: string;
  chatId: string;
  branchId: string;
  datetime: string;
  isRedacted: boolean;
  messageId: string;
  text: string;
  message_type: MessageType;
  parent_chat_id: string;
}

export type TChatMessageWithFlags = TChatMessage & {
  first: boolean;
  last: boolean;
  isFromOtherUser: boolean;
};
