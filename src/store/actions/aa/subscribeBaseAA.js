import client from "../../../socket";
import config from "../../../config";
import { SUBSCRIBE_BASE_AA } from "../../types/aa";

export const subscribeBaseAA = () => async dispatch => {
  try {
    await client.justsaying("light/new_aa_to_watch", {
      aa: config.BASE_AA
    });
    await dispatch({
      type: SUBSCRIBE_BASE_AA
    });
  } catch (e) {
    console.log("error", e);
  }
};
