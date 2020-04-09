import { ADD_COLLATERAL } from "../../types/aa";

export const addCollateral = (id, collateral) => async (dispatch, getState) => {
  try {
    const store = getState();
    const activeCoins = store.aa.activeCoins;

    const isFinded = String(id) in activeCoins;
    if (isFinded && activeCoins[id].collateral >= collateral) {
      const exchange_rate = store.aa.activeDataFeedMa;
      const min_collateral =
        (activeCoins[id].amount /
          Math.pow(10, store.aa.activeParams.decimals) /
          exchange_rate) *
        1000000000;
      const min_collateral_liquidation = Math.round(
        min_collateral * store.aa.activeParams.liquidation_ratio
      );
      const atAuction = activeCoins[id].collateral < min_collateral_liquidation;
      dispatch({
        type: ADD_COLLATERAL,
        payload: { id, collateral, atAuction }
      });
    }
  } catch (e) {
    console.log("error", e);
  }
};
