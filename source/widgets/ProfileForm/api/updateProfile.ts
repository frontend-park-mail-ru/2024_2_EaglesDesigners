import { ProfileRequest } from "@/shared/api/types";

export const genProfileData = (profileData : ProfileRequest, avatar : File) => {
    const formData : FormData = new FormData();
    const jsonProfileData = JSON.stringify(profileData);
    formData.append('profile_data', jsonProfileData);
    formData.append('avatar', avatar);

    return formData;
};
