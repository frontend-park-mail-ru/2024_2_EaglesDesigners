export interface TChatMessage {
  authorID: string;
  authorName: string;
  chatId: string;
  datetime: string;
  isRedacted: boolean;
  messageId: string;
  text: string;
}

export type TChatMessageWithFlags = TChatMessage & {
  first: boolean;
  last: boolean;
  isFromOtherUser: boolean;
};
