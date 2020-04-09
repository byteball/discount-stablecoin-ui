import { ADD_SYMBOLS_TO_LIST } from "../types/symbols";
import { ADD_SYMBOL_BY_AA } from "../types/aa";

const initialState = {};

export const symbolsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SYMBOLS_TO_LIST: {
      return {
        ...state,
        ...action.payload
      };
    }
    case ADD_SYMBOL_BY_AA: {
      if (action.payload.address in state) {
        return state;
      } else {
        return {
          ...state,
          [action.payload.address]: {
            symbol: action.payload.symbol,
            latestUpdate: action.payload.today
          }
        };
      }
    }
    default:
      return state;
  }
};
