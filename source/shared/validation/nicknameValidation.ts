const regex = /^[а-яА-Яa-zA-Z0-9_ ]+$/; // Регулярное выражение для проверки

/**
 * validate nickname
 * @param {text} nick - value of user nickname
 * @returns {bool} if nickname is valid - true, else false
 */
export const validateNickname = (nick: string) => {
  if (!regex.test(nick)) {
    return false;
  }
  return true;
};
