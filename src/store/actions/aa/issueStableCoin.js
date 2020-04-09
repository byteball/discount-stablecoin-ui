import { ISSUE_STABLE_COIN } from "../../types/aa";
import { addStableCoinToAuction } from "../auction";

export const issueStableCoin = ({ id, owner, collateral, amount }) => async (
  dispatch,
  getState
) => {
  try {
    const store = getState();
    const exchange_rate = store.aa.activeDataFeedMa;
    const min_collateral =
      (amount / Math.pow(10, store.aa.activeParams.decimals) / exchange_rate) *
      1000000000;
    const min_collateral_liquidation = Math.round(
      min_collateral * store.aa.activeParams.liquidation_ratio
    );
    const atAuction = collateral < min_collateral_liquidation;
    dispatch({
      type: ISSUE_STABLE_COIN,
      payload: { id, owner, collateral, amount, atAuction }
    });
    if (atAuction) {
      const opening_collateral = Math.round(
        min_collateral * store.aa.activeParams.overcollateralization_ratio
      );
      dispatch(
        addStableCoinToAuction({
          id,
          owner,
          collateral,
          amount,
          opening_collateral,
          atAuction
        })
      );
    }
  } catch (e) {
    console.log("error", e);
  }
};
