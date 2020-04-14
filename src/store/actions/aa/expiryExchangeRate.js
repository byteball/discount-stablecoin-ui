import { EXPIRY_RATE } from "../../types/aa";
import moment from "moment";

export const expiryExchangeRate = rate => async (dispatch, getState) => {
  try {
    const store = getState();
    const DateNow = moment()
      .utc(false)
      .unix();
    if (DateNow > moment(store.aa.activeParams.expiry_date).unix()) {
      dispatch({
        type: EXPIRY_RATE,
        payload: { rate }
      });
    }
  } catch (e) {
    console.log("error", e);
  }
};
