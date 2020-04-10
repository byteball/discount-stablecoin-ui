import { truncate } from "lodash";

const truncateOptions = { length: 13 };

export const createStringDescrForAa = (
  address,
  feed_name,
  expiry_date,
  symbol
) => {
  const vFN = truncate(feed_name, truncateOptions);
  if (symbol) {
    return `${vFN} on ${expiry_date}: ${symbol} (${address})`;
  } else {
    return `${vFN} on ${expiry_date} (${address})`;
  }
};
