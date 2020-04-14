import {
  ADD_BID_COIN_AUCTION,
  ADD_FOR_AUCTION,
  END_AUCTION_REQUEST,
  END_AUCTION_RESPONSE,
  END_COIN_AUCTION,
  INIT_AUCTION,
  REMOVE_FOR_AUCTION
} from "../types/auction";
import { ADD_STABLE_COIN_TO_AUCTION } from "../types/aa";
import moment from "moment";

export const initAuction = initValue => ({
  type: INIT_AUCTION,
  payload: initValue
});

export const addForAuction = coinInfo => ({
  type: ADD_FOR_AUCTION,
  payload: { ...coinInfo }
});

export const removeForAuction = id => ({
  type: REMOVE_FOR_AUCTION,
  payload: id
});

export const addBidForCoinAuction = (id, newBid, timestamp, isRes) => async (
  dispatch,
  getState
) => {
  const store = getState();
  let end_time;
  if (isRes) {
    end_time = timestamp;
  } else {
    end_time = timestamp + store.aa.activeParams.auction_period;
  }
  const coin = store.auction.coins[id];
  const winner_bid = Number(coin.winner_bid);
  const opening_collateral = Number(coin.opening_collateral);
  const collateral = Number(coin.collateral);
  const current_bid = winner_bid ? winner_bid : opening_collateral - collateral;
  if (current_bid && newBid >= current_bid) {
    dispatch({
      type: ADD_BID_COIN_AUCTION,
      payload: { ...coin, id, winner_bid: newBid, auction_end_ts: end_time }
    });
  }
};

export const endCoinAuction = id => ({
  type: END_COIN_AUCTION,
  payload: id
});

export const addStableCoinToAuction = ({
  id,
  amount,
  collateral,
  owner,
  opening_collateral
}) => ({
  type: ADD_STABLE_COIN_TO_AUCTION,
  payload: { id, amount, collateral, owner, opening_collateral }
});

export const endAuctionRequest = id => async (dispatch, getState) => {
  const store = getState();
  const time =
    store.auction.coins &&
    store.auction.coins[id] &&
    store.auction.coins[id].auction_end_ts;
  const dateNow = moment()
    .utc(false)
    .unix();
  if (time && Number(time) < dateNow) {
    dispatch({ type: END_AUCTION_REQUEST, payload: { id } });
  }
};

export const endAuctionResponse = (id, owner, collateral) => async dispatch => {
  dispatch({
    type: END_AUCTION_RESPONSE,
    payload: { id, owner, collateral }
  });
};
