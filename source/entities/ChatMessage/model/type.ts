export type  MessageType = "informational" | "default" | "with_payload";

export interface TChatMessage {
  authorID: string;
  chatId: string;
  branchId: string;
  datetime: string;
  isRedacted: boolean;
  messageId: string;
  text: string;
  photos: TChatMessageAttachment[];
  files: TChatMessageAttachment[];
  message_type: MessageType;
}

export interface TChatMessageAttachment {
  url: string;
  filename: string;
  size: number;
}

export type TChatMessageWithFlags = TChatMessage & {
  first: boolean;
  last: boolean;
  isFromOtherUser: boolean;
};
