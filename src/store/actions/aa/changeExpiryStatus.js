import { EXPIRY_STATUS } from "../../types/aa";

export const changeExpiryStatus = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: EXPIRY_STATUS
    });
  } catch (e) {
    console.log("error", e);
  }
};
