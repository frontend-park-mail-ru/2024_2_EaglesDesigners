import { API } from "@/shared/api/api";
import { EmptyResponse } from "@/shared/api/types";

export const SendSticker = async (chatId : string, stickerURL : string) => {
    const formData = new FormData();
    formData.append("sticker", JSON.stringify(stickerURL));

    const response = await API.postFormData<EmptyResponse>(
        `/chat/${chatId}/messages`,
        formData,
      );

    return response;
};