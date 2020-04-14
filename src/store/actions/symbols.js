import { ADD_SYMBOLS_TO_LIST } from "../types/symbols";

export const addSymbolsToList = assets => ({
  type: ADD_SYMBOLS_TO_LIST,
  payload: assets
});
