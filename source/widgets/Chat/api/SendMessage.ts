import { API } from "@/shared/api/api";
import { EmptyResponse } from "@/shared/api/types";

export const SendMessage = async (chatId : string, text : string, files? : File[], photos? : File[]) => {
    const formData = new FormData();
    formData.append("text", JSON.stringify(text));
    files?.map((file) => {
        formData.append('files', file);
    })
    photos?.map((photo) => {
        formData.append('photos', photo);
    })

    const response = await API.postFormData<EmptyResponse>(
        `/chat/${chatId}/messages`,
        formData,
      );

    return response;
};