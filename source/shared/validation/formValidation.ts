/**
 * validate form
 * @param {object, text, object} classObject - object where happened error, error - content of error, text - object where add text of error
 * @returns {}
 */
export const validateForm = (classObject, error, text) => {
  classObject.classList.add("error");
  text.textContent = error;
};
