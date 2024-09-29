const regex = /^[a-zA-Z0-9_]+$/; // Регулярное выражение для проверки


export const validateEmail = (emailValue) => {
    if (!regex.test(emailValue)) { 
        console.log('я тут')
        return false
    } 
    return true;
}
