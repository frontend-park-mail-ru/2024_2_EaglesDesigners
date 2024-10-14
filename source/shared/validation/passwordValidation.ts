const regex = /^[a-zA-Z0-9_]+$/; // Регулярное выражение для проверки

/**
 * validate password
 * @param {text} passwordValue - value of user password
 * @returns {bool} if password is valid - true, else false
 */
export const validatePassword = (passwordValue: string) => {
  if (passwordValue.length < 8 || !regex.test(passwordValue)) {
    return false;
  }
  return true;
};
