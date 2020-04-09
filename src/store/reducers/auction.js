import {
  ADD_BID_COIN_AUCTION,
  ADD_FOR_AUCTION,
  END_AUCTION_RESPONSE,
  END_AUCTION_REQUEST,
  END_COIN_AUCTION,
  INIT_AUCTION,
  REMOVE_FOR_AUCTION
} from "../types/auction";
import { ADD_STABLE_COIN_TO_AUCTION } from "../types/aa";

const initialState = {
  coins: {}
};

export const auctionReducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT_AUCTION: {
      return {
        ...state,
        coins: action.payload
      };
    }
    case ADD_FOR_AUCTION: {
      return {
        ...state,
        coins: { ...state.coins, ...action.payload }
      };
    }
    case REMOVE_FOR_AUCTION: {
      let newCoins = {};
      for (const key in state.coins) {
        if (key !== action.payload) {
          newCoins[key] = state.coins[key];
        }
      }
      return {
        ...state,
        coins: newCoins
      };
    }
    case ADD_BID_COIN_AUCTION: {
      return {
        ...state,
        coins: {
          ...state.coins,
          [action.payload.id]: {
            ...state.coins[action.payload.id],
            ...action.payload,
            status: "active"
          }
        }
      };
    }
    case END_COIN_AUCTION: {
      return {
        ...state,
        coins: {
          ...state.coins,
          [action.payload]: { ...state.coins[action.payload], status: "end" }
        }
      };
    }
    case END_AUCTION_REQUEST: {
      const newCoins = Object.assign({}, state.coins);
      delete newCoins[action.payload.id];
      return {
        ...state,
        coins: newCoins
      };
    }
    case END_AUCTION_RESPONSE: {
      const newCoins = Object.assign({}, state.coins);
      delete newCoins[action.payload.id];
      return {
        ...state,
        coins: newCoins
      };
    }
    case ADD_STABLE_COIN_TO_AUCTION: {
      return {
        ...state,
        coins: {
          ...state.coins,
          [action.payload.id]: {
            amount: action.payload.amount,
            collateral: action.payload.collateral,
            owner: action.payload.owner,
            opening_collateral: action.payload.opening_collateral,
            atAuction: action.payload.atAuction,
            status: "open"
          }
        }
      };
    }
    default:
      return state;
  }
};
