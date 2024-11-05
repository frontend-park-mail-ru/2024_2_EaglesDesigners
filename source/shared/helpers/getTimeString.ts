export const getTimeString = (datetime: string) => {
  const date = new Date(datetime);

  const hours = String(date.getHours()).padStart(2, "0"); // Часы
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Минуты

  return `${hours}:${minutes}`;
};
