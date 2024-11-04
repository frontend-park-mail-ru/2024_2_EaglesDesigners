export const validateYear = (birthdate: Date) => {
  if (1920 <= birthdate.getFullYear() && birthdate < new Date()) {
    return true;
  }
  return false;
};
