const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

const responseToDate = (month, day, timeString, year = null) => {
  const [hour, minute] = timeString.split(":");
  if (!year) {
    year = new Date().getFullYear();
  }
  return new Date(
    Date.UTC(year, month - 1, day, parseInt(hour), parseInt(minute))
  );
};

module.exports = {
  chunk,
  responseToDate
};
