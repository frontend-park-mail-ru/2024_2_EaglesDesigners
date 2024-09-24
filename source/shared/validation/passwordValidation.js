'use strict'
export const validatePassword = (passwordValue) => {
    if (!passwordValue.length) {
        return false;
    }
    return true;
}
