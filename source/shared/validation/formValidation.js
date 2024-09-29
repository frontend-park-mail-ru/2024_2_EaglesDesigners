export const validateForm = (classObject, error, text) => {
    classObject.classList.add('error');
    text.textContent = error;
}