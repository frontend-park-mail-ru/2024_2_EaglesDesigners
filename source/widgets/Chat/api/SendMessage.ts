import { API } from "@/shared/api/api";
import { EmptyResponse } from "@/shared/api/types";

export const SendMessage = async (chatId : string, text : string, files : File[], photos : File[]) => {
    const formData = new FormData();
    formData.append("text", JSON.stringify(text));
    console.log("hi");

    const response = await API.postFormData<EmptyResponse>(
        `/chat/${chatId}/messages`,
        formData,
      );

    return response;
};