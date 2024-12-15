export interface TChatMessage {
  authorID: string;
  chatId: string;
  branchId: string;
  datetime: string;
  isRedacted: boolean;
  messageId: string;
  text: string;
  photos: string[];
  files: string[];
}

export type TChatMessageWithFlags = TChatMessage & {
  first: boolean;
  last: boolean;
  isFromOtherUser: boolean;
};
