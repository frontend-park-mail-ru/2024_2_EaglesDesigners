const regex = /^[a-zA-Z0-9_]+$/; // Регулярное выражение для проверки

/**
 * validate login
 * @param {text} username - value of username
 * @returns {bool} if username is valid - true, else false
 */
export const validateLogin = (username: string) => {
  if (username.length < 6 || !regex.test(username)) {
    return false;
  }
  return true;
};
