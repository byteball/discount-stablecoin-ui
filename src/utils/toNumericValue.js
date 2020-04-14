export const toNumericValue = (value, quotes = true) => {
  const t = /^[0-9.]+$/.test(value);
  if (t && value <= Number.MAX_SAFE_INTEGER) {
    return Number(value);
  } else {
    if (quotes) {
      return `'${value}'`;
    } else {
      return `${value}`;
    }
  }
};
