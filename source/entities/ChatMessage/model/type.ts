export type  MessageType = "informational" | "default" | "with_payload" | "sticker";

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
  sticker: string;
  message_type: MessageType;
  parent_chat_id: string;
}

export interface TStickerPack {
  photo: string;
  id: string;
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
