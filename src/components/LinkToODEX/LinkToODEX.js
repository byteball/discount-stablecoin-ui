import config from "../../config";
import React from "react";

export const LinkToODEX = ({ symbol, ...rest }) => {
  if (symbol) {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
        href={config.LINK_TO_ODEX + "GBYTE/" + symbol}
      >
        Trade on ODEX
      </a>
    );
  } else {
    return null;
  }
};
