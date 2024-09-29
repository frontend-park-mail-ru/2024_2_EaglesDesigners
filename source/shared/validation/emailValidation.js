export const validateEmail = (emailValue) => {
    if (!emailValue.length) {
        return false;
    }
    return true;
}
