import client from "../../../socket";
import config from "../../../config";

export const subscribeTokenRegistry = () => async dispatch => {
  try {
    await client.justsaying("light/new_aa_to_watch", {
      aa: config.TOKEN_REGISTRY_AA_ADDRESS
    });
  } catch (e) {
    console.log("error", e);
  }
};
