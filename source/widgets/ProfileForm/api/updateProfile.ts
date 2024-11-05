import { UserStorage } from "@/entities/User";
import { API } from "@/shared/api/api";
import { ProfileRequest, ProfileResponse } from "@/shared/api/types";
import { Router } from "@/shared/Router/Router";

export const genProfileData = async (
  profileData: ProfileRequest,
  avatar: File,
) => {
  const formData: FormData = new FormData();
  const jsonProfileData = JSON.stringify(profileData);
  formData.append("profile_data", jsonProfileData);
  formData.append("avatar", avatar);

  const response = await API.putFormData<ProfileResponse>("/profile", formData);
  let errorMessage: string;
  if (!response.error) {
    UserStorage.setUserName(profileData.name);
    Router.go("/");
    return "";
  }
  errorMessage = response.error;
  return errorMessage;
};
