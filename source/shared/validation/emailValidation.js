const regex = /^[a-zA-Z0-9_]+$/; // Регулярное выражение для проверки


export const validateEmail = (emailValue) => {
    if (!regex.test(emailValue)) { 
        return false
    } 
    return true;
}
