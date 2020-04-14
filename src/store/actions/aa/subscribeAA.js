import client from "../../../socket";
import { SUBSCRIBE_AA } from "../../types/aa";

export const subscribeAA = address => async (dispatch, getState) => {
  try {
    const store = getState();
    const subscriptions = store.aa.subscriptions;
    const isSubscription =
      subscriptions.filter(aa => aa === address).length > 0;
    if (!isSubscription) {
      await client.justsaying("light/new_aa_to_watch", {
        aa: address
      });

      await dispatch({
        type: SUBSCRIBE_AA,
        payload: address
      });
    }
  } catch (e) {
    console.log("error", e);
  }
};
