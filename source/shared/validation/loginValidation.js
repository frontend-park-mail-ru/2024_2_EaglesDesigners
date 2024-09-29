const regex = /^[a-zA-Z0-9_]+$/; // Регулярное выражение для проверки


export const validateLogin = (username) => {
    if (!regex.test(username)) { 
        return false
    } 
    return true;
}
