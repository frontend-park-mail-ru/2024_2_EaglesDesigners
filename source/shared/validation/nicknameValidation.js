const regex = /^[а-яА-Яa-zA-Z0-9_ ]+$/; // Регулярное выражение для проверки

export const validateNickname = (nick) => {
    if (!regex.test(nick)) { 
        return false
    } 
    return true
}