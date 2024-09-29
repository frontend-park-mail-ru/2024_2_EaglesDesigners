const regex = /^[a-zA-Z0-9_]+$/; // Регулярное выражение для проверки

export const validatePassword = (passwordValue) => {
  if (passwordValue.length < 8 || !regex.test(passwordValue)) {
    return false;
  }
  return true;
};
