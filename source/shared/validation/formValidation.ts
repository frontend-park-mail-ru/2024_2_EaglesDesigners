/**
 * validate form
 * @param {object, text, object} classObject - object where happened error, error - content of error, text - object where add text of error
 * @returns {}
 */
export const validateForm = (
  classObject: HTMLInputElement,
  error: string,
  text: HTMLSpanElement,
) => {
  classObject.classList.add("error");
  text.textContent = error;
};
