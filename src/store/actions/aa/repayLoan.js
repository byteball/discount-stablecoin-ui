import { LOAN_REPAY } from "../../types/aa";

export const repayLoan = (id, address) => async (dispatch, getState) => {
  try {
    const store = getState();
    const activeCoins = store.aa.activeCoins;

    const isOwner =
      String(id) in activeCoins && activeCoins[id].owner === address;
    const isNotAuction = !activeCoins[id].atAuction;
    if (isOwner && isNotAuction) {
      if (!("repaid" in activeCoins[id])) {
        dispatch({
          type: LOAN_REPAY,
          payload: { id }
        });
      }
    }
  } catch (e) {
    console.log("error", e);
  }
};
