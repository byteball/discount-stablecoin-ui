import { ADD_RECENT_STABLECOIN } from "../types/recent";
const initialState = [];

export const recentReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_RECENT_STABLECOIN: {
      const address = action.payload;
      let newRecentStablecoins = state.slice();
      const findAaInRecent = newRecentStablecoins.findIndex(
        aa => aa === address
      );
      if (findAaInRecent === -1) {
        if (newRecentStablecoins && newRecentStablecoins.length >= 5) {
          newRecentStablecoins.pop();
        }
        newRecentStablecoins.unshift(address);
      } else {
        [newRecentStablecoins[0], newRecentStablecoins[findAaInRecent]] = [
          newRecentStablecoins[findAaInRecent],
          newRecentStablecoins[0]
        ];
      }
      return newRecentStablecoins;
    }
    default:
      return state;
  }
};
