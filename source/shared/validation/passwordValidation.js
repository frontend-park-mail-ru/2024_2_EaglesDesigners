'use strict'
export const validatePassword = (passwordValue) => {
    if (passwordValue.length < 8) {
        return false;
    }
    return true;
}
