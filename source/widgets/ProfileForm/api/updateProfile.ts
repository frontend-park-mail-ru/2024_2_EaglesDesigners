import { UserStorage } from "@/entities/User";
import { API } from "@/shared/api/api";
import { ProfileRequest, ProfileResponse } from "@/shared/api/types";

export const genProfileData = async (
  profileData: ProfileRequest,
  avatar: File,
) => {
  const formData: FormData = new FormData();
  const jsonProfileData = JSON.stringify(profileData);
  formData.append("profile_data", jsonProfileData);
  formData.append("avatar", avatar);

  const response = await API.putFormData<ProfileResponse>("/profile", formData);
  if (!response.error) {
    UserStorage.setUserName(profileData.name);
    return "";
  }
  const errorMessage = response.error;
  return errorMessage;
};
