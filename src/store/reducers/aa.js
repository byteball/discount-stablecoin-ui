import {
  SUBSCRIBE_BASE_AA,
  LOAD_AA_LIST_REQUEST,
  LOAD_AA_LIST_SUCCESS,
  ADD_AA_TO_LIST,
  SUBSCRIBE_AA,
  CHANGE_ACTIVE_AA,
  ASSET_REQUEST,
  ASSET_RESPONSE,
  UPDATE_INFO_ACTIVE_AA,
  OPEN_NETWORK,
  CLOSE_NETWORK,
  ADD_COLLATERAL,
  LOAN_REPAY,
  EXPIRY_RATE,
  ISSUE_STABLE_COIN,
  UPDATE_RATE,
  EXPIRY_STATUS,
  AAS_TOTAL_COIN_LIST_REQUEST,
  AAS_TOTAL_COIN_LIST_SUCCESS,
  ADD_SYMBOL_BY_AA
} from "../types/aa";
import { ADD_BID_COIN_AUCTION, END_AUCTION_RESPONSE } from "../types/auction";

const initialState = {
  network: true,
  listByBase: [],
  listByBaseLoaded: false,
  totalCoinList: {},
  totalCoinListLoaded: false,
  active: null,
  activeInfo: null,
  symbol: null,
  activeAssetRequest: false,
  activeParams: {},
  activeCoins: {},
  activeDataFeed: null,
  activeDataFeedMa: null,
  subscribeBase: false,
  subscriptions: [],
  isExpired: false
};

export const aaReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBSCRIBE_BASE_AA: {
      return {
        ...state,
        subscribeBase: true
      };
    }
    case LOAD_AA_LIST_REQUEST: {
      return {
        ...state,
        listByBaseLoaded: false
      };
    }
    case LOAD_AA_LIST_SUCCESS: {
      return {
        ...state,
        listByBase: action.payload,
        listByBaseLoaded: true
      };
    }
    case ASSET_REQUEST: {
      return {
        ...state,
        activeAssetRequest: true
      };
    }
    case ADD_SYMBOL_BY_AA: {
      if (state.active === action.payload.address) {
        return {
          ...state,
          symbol: action.payload.symbol
        };
      } else {
        return state;
      }
    }
    case ASSET_RESPONSE: {
      return {
        ...state,
        activeInfo: {
          ...state.activeInfo,
          asset: action.payload
        }
      };
    }
    case ADD_AA_TO_LIST: {
      const newListByBase = state.listByBase.filter(
        aa => aa.address !== action.payload.address
      );
      return {
        ...state,
        listByBase: [
          ...newListByBase,
          { ...action.payload, isStable: action.payload.isStable }
        ]
      };
    }
    case SUBSCRIBE_AA: {
      return {
        ...state,
        subscriptions: [...state.subscriptions, action.payload]
      };
    }
    case OPEN_NETWORK: {
      return {
        ...state,
        network: true
      };
    }
    case CLOSE_NETWORK: {
      return {
        ...state,
        network: false,
        subscriptions: []
      };
    }
    case CHANGE_ACTIVE_AA: {
      return {
        ...state,
        active: action.payload.address,
        activeInfo: action.payload.aaVars || null,
        activeParams: action.payload.params,
        activeCoins: action.payload.coins,
        activeDataFeed: action.payload.data_feed,
        activeDataFeedMa: action.payload.data_feed_ma,
        activeAssetRequest: false,
        isExpired: action.payload.isExpired,
        symbol: action.payload.symbol || null
      };
    }
    case UPDATE_INFO_ACTIVE_AA: {
      return {
        ...state,
        activeInfo: action.payload.aaVars || null,
        activeCoins: action.payload.coins,
        activeDataFeed: action.payload.data_feed,
        activeDataFeedMa: action.payload.data_feed_ma
      };
    }
    case ADD_COLLATERAL: {
      return {
        ...state,
        activeCoins: {
          ...state.activeCoins,
          [action.payload.id]: {
            ...state.activeCoins[action.payload.id],
            collateral: action.payload.collateral,
            atAuction: action.payload.atAuction
          }
        },
        activeInfo: {
          ...state.activeInfo,
          [action.payload.id + "_collateral"]: String(action.payload.collateral)
        }
      };
    }
    case LOAN_REPAY: {
      return {
        ...state,
        activeCoins: {
          ...state.activeCoins,
          [action.payload.id]: {
            ...state.activeCoins[action.payload.id],
            repaid: 1
          }
        },
        activeInfo: {
          ...state.activeInfo,
          [action.payload.id + "_repaid"]: 1
        }
      };
    }
    case EXPIRY_RATE: {
      return {
        ...state,
        activeInfo: {
          ...state.activeInfo,
          expiry_exchange_rate: action.payload.rate
        },
        activeCoins: {
          ...state.activeCoins,
          expiry: {
            exchange_rate: action.payload.rate
          }
        }
      };
    }
    case ISSUE_STABLE_COIN: {
      return {
        ...state,
        activeInfo: {
          ...state.activeInfo,
          [action.payload.id + "_amount"]: action.payload.amount,
          [action.payload.id + "_owner"]: action.payload.owner,
          [action.payload.id + "_collateral"]: action.payload.collateral
        },
        activeCoins: {
          ...state.activeCoins,
          [action.payload.id]: {
            amount: action.payload.amount,
            owner: action.payload.owner,
            collateral: action.payload.collateral,
            atAuction: action.payload.atAuction
          }
        }
      };
    }
    case END_AUCTION_RESPONSE: {
      return {
        ...state,
        activeCoins: {
          ...state.activeCoins,
          [action.payload.id]: {
            ...state.activeCoins[action.payload.id],
            owner: action.payload.owner,
            collateral: action.payload.collateral,
            atAuction: false
          }
        },
        activeInfo: {
          ...state.activeInfo,
          [action.payload.id + "_owner"]: action.payload.owner,
          [action.payload.id + "_collateral"]: action.payload.collateral
        }
      };
    }
    case UPDATE_RATE: {
      return {
        ...state,
        activeDataFeed: action.payload.data_feed,
        activeDataFeedMa: action.payload.data_feed_ma
      };
    }

    case ADD_BID_COIN_AUCTION: {
      return {
        ...state,
        activeInfo: {
          ...state.activeInfo,
          [action.payload.id + "_winner_bid"]: action.payload.winner_bid,
          [action.payload.id + "_auction_end_ts"]: action.payload.auction_end_ts
        },
        activeCoins: {
          ...state.activeCoins,
          [action.payload.id]: {
            ...state.activeCoins[action.payload.id],
            winner_bid: action.payload.winner_bid,
            auction_end_ts: action.payload.auction_end_ts
          }
        }
      };
    }
    case EXPIRY_STATUS: {
      return {
        ...state,
        isExpired: true
      };
    }
    case AAS_TOTAL_COIN_LIST_REQUEST: {
      return {
        ...state,
        totalCoinListLoaded: false
      };
    }
    case AAS_TOTAL_COIN_LIST_SUCCESS: {
      return {
        ...state,
        totalCoinList: action.payload,
        totalCoinListLoaded: true
      };
    }
    default:
      return state;
  }
};
