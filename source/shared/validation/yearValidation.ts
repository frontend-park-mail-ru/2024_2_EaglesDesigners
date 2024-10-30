
export const validateYear = (year : number) => {
    if (year <= 2020 && 1920 <= year) {
        return true;
    }
    return false;
};